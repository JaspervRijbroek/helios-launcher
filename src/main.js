import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import Messenger from "./lib/messenger";
import Downloader from "./lib/downloader";

const {app, BrowserWindow, ipcMain} = require('electron');
const {existsSync, createReadStream} = require('fs');
const path = require('path');
const tempFile = app.getPath('temp') + '/nfsw.tgz';
const tar = require('tar');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

app.applicationMenu && app.applicationMenu.setApplicationMenu(null);
app.whenReady().then(() => {
    installExtension(VUEJS_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 550,
        height: 180,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    let messenger = new Messenger(mainWindow),
        downloader = new Downloader(messenger);

    // let messager = new MainMessager(mainWindow);
    //
    // messager
    //     .on('unpack:start', function (downloadPath) {
    //         // Get the file list.
    //         let files = 20911, // Hardcoded as it will take some time if this is calculated.
    //             passedFiles = 0,
    //             self = this;
    //
    //         console.log('Checking files')
    //         tar.x({
    //             file: tempFile,
    //             cwd: app.getPath('documents'),
    //             onentry: (entry) => {
    //                 if(entry.type === 'File') {
    //                     passedFiles++
    //                     self.emit('status:update', 'Unpacking', (passedFiles / files * 100).toFixed(2));
    //                 }
    //             }
    //         });
    //     })
    //     .on('download:start', function (tempPath) {
    //         var self = this;
    //         const {request} = require('http');
    //         const {createWriteStream} = require('fs');
    //
    //         const downloadFile = createWriteStream(tempPath);
    //
    //         request('http://server.jvar.nl/NFSW.tgz', (res) => {
    //             let totalLength = res.headers['content-length'],
    //                 currentLength = 0;
    //
    //             res.on('end', () => {
    //                 messager.emit('unpack:start');
    //             });
    //
    //             res
    //                 .pipe(require('through2')(function (chunk, enc, callback) {
    //                     currentLength += chunk.length;
    //
    //                     self.emit('status:update', 'Downloading', ((currentLength / totalLength) * 100).toFixed(2));
    //
    //                     this.push(chunk);
    //
    //                     callback();
    //                 }))
    //                 .pipe(downloadFile);
    //         }).end();
    //     });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});