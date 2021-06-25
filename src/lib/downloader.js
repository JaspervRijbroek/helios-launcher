import got from "got";
import {existsSync, statSync, createWriteStream} from 'fs';
import {app} from 'electron';
import * as through2 from 'through2';
import {extract} from 'tar';
import {pipeline} from 'stream';
import {spawn} from 'child_process';

export default class Downloader {
    constructor(messenger) {
        this.tempFile = app.getPath('temp') + '/nfsw.tgz';
        this.unpackPath = app.getPath('documents');
        this.downloadUrl = 'http://server.jvar.nl/NFSW.tgz';
        this.messenger = messenger;
        this.isWorking = false;

        messenger
            .on('app:started', this.appStarted.bind(this))
            .on('download:start', this.download.bind(this))
            .on('unpack:start', this.unpack.bind(this))
            .on('client:launch', this.launchGame.bind(this));
    }

    async appStarted() {
        if (this.isWorking) {
            return;
        }

        this.isWorking = true;

        // Check if all the files are there.
        // Also do a check on the size of the download file.
        if (existsSync(this.unpackPath + '/NFSW/nfsw.exe')) {
            this.isWorking = false;
            return this.messenger.send('client:ready');
        }

        if (existsSync(this.tempFile) && await this.checkDownloadSize()) {
            return this.messenger.emit('unpack:start');
        }

        return this.messenger.emit('download:start');
    }

    async download() {
        // If there already is a file,
        // if so continue download.
        let fileSize = 0,
            targetExists = existsSync(this.tempFile),
            downloadSize = await this.getDownloadSize(),
            targetFile = createWriteStream(this.tempFile, {
                flags: 'a'
            }),
            self = this;

        if (targetExists) {
            fileSize = statSync(this.tempFile).size;
        }

        pipeline(
            got.stream(this.downloadUrl, {
                headers: {
                    'Range': `bytes=${fileSize}-`
                }
            }),
            through2(function (chunk, enc, callback) {
                fileSize += chunk.length;

                self.messenger.send('status:update', 'Downloading', (fileSize / downloadSize * 100).toFixed(0));

                this.push(chunk);

                callback();
            }),
            targetFile,
            function () {
                self.messenger.emit('unpack:start');
            }
        );
    }

    unpack() {
        let files = 20911, // Hardcoded as it will take some time if this is calculated.
            passedFiles = 0,
            self = this;

        extract({
            file: this.tempFile,
            cwd: app.getPath('documents'),
            onentry: (entry) => {
                if (entry.type === 'File') {
                    passedFiles++
                    self.messenger.send('status:update', 'Unpacking', (passedFiles / files * 100).toFixed(0));
                }
            }
        }).then(() => {
            this.isWorking = false;
            this.messenger.send('client:ready');
        });
    }

    async checkDownloadSize() {
        let fileSize = statSync(this.tempFile).size,
            downloadSize = await this.getDownloadSize();

        return fileSize == downloadSize;
    }

    async getDownloadSize() {
        let response = await got(this.downloadUrl, {
            method: 'HEAD'
        });

        return response.headers["content-length"];
    }

    launchGame(server, username, password) {
        this.messenger.send('client:running', true);
        let process = spawn(`${this.unpackPath}/NFSW/nfsw.exe`, ['US', server, password, username]);
        process
            .on('exit', (code, signal) => {
                this.messenger.send('client:running', false);
            })
            .on('error', () => {
                this.messenger.send('client:running', false);
            })
    }
}