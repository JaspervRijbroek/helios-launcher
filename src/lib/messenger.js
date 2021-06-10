const electron = require('electron');
const {EventEmitter} = require('events');

export default class Messenger extends EventEmitter {
    constructor(arg = null) {
        super();

        this.isMain = require('electron').hasOwnProperty('ipcMain');
        this.channel = 'helios-messages';

        // If this is the main process then we need to call the webContents and arg is the mainWindow.
        // Else we get a store and we use the ipcRenderer.
        this.messenger = this.isMain ? arg.webContents : electron.ipcRenderer;
        this.receiver = this.isMain ? electron.ipcMain : electron.ipcRenderer;

        this.receiver.on(this.channel, (event, [message, ...data]) => {
            this.emit(message, ...data);
        });
    }

    send(event, ...data) {
        this.messenger.send(this.channel, [event, ...data]);
    }
}