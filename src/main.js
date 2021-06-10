import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
import Messenger from "./lib/messenger";
import Downloader from "./lib/downloader";

const {app, BrowserWindow, autoUpdater, dialog} = require('electron');
const server = 'http://server.jvar.nl:8123'
const url = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url })

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})

app.applicationMenu && app.applicationMenu.setApplicationMenu(null);
app.whenReady().then(() => {
    installExtension(VUEJS_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 550,
        height: 180,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    mainWindow.webContents.openDevTools();

    let messenger = new Messenger(mainWindow),
        downloader = new Downloader(messenger);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});