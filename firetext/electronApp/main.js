/* global require, process, console, global, __dirname */
'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = require('electron').Menu;
const dialog = require('electron').dialog;
const ipc = require('electron').ipcMain;
const path = require('path');
const pjson = require('./package.json');
const _ = require('lodash');
const electronStore = require('electron-store');
const store = new electronStore();
let browserConfig = store.get('window', {"x":0,"y":0,"width":0,"height":0, "maximized":false});

// Use system log facility, should work on Windows too
require('./lib/log')(pjson.productName || 'SkelEktron');

// Manage unhandled exceptions as early as possible
process.on('uncaughtException', e => {
  console.error(`Caught unhandled exception: ${e}`);
  dialog.showErrorBox('Caught unhandled exception', e.message || 'Unknown error message');
  app.quit();
});

// Load build target configuration file
try {
  let config = require('./config.json');
  _.merge(pjson.config, config);
} catch (e) {
  console.warn('No config file loaded, using defaults');
}

const isDev = (require('electron-is-dev') || pjson.config.debug);
global.appSettings = pjson.config;

if (isDev) {
  console.info('Running in development');
  console.debug(JSON.stringify(pjson.config));
  
  // Adds debug features like hotkeys for triggering dev tools and reload
  // (disabled in production, unless the menu item is displayed)
  require('electron-debug')({
    enabled: pjson.config.debug || isDev || false
  });
} else {
  console.info('Running in production');
}


// Prevent window being garbage collected
let mainWindow;

// Other windows we may need
let infoWindow = null;

app.setName(pjson.productName || 'Firetext');

/**
 * [initialize description]
 * @return {[type]} [description]
 */
function initialize() {
  var shouldQuit = makeSingleInstance();

  if (shouldQuit) {
    return app.quit();
  }

  // Use printer utility lib (requires printer module, see README)
  // require('./lib/printer')

  /**
   * [onClosed description]
   */
  function onClosed() {
    // Dereference used windows
    // for multiple windows store them in an array
    mainWindow = null;
    infoWindow = null;
  }

  /**
  * [createMainWindow description]
  * @return {[type]} [description]
  */
  function createMainWindow() {
    const win = new electron.BrowserWindow({
      x: browserConfig.x,
      y: browserConfig.y,
      width: browserConfig.width,
      height: browserConfig.height,
      title: app.getName(),
      icon: path.join(__dirname, 'icon.png'),
      webPreferences: {
        // Disabling node integration allows to use libraries such as jQuery/React, etc
        nodeIntegration: pjson.config.nodeIntegration || true,
        preload: path.resolve(path.join(__dirname, 'preload.js'))
      }
    });

    // Remove file:// if you need to load http URLs
    win.loadURL(`file://${__dirname}/${pjson.config.url}`, {});

    win.on('closed', onClosed);
    win.on('close', function() {
      let config = win.getBounds();

      browserConfig.x = config.x;
      browserConfig.y = config.y;
      browserConfig.width = config.width;
      browserConfig.height = config.height;

      store.set('window', browserConfig);
    });

    win.on('show', function() {
      if (browserConfig.maximized) {
        win.maximize();
      }
    })

    win.on('maximize', function() {
      browserConfig.maximize = true;
    });

    win.on('unmaximize', function() {
      browserConfig.maximize = false;
    })

    win.on('unresponsive', function unresponsive() {
      dialog.showErrorBox('Unresponsive Program', 'the program is currently under heavy load please wait...');
      console.warn('The windows is not responding');
    });

    win.webContents.on('did-fail-load', (error, errorCode, errorDescription) => {
      var errorMessage;

      if (errorCode === -105) {
        errorMessage = errorDescription || '[Connection Error] The host name could not be resolved, check your network connection';
        console.error(errorMessage);
      } else {
        errorMessage = errorDescription || 'Unknown error';
      }

      error.sender.loadURL(`file://${__dirname}/error.html`);
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('app-error', errorMessage);
      });
    });

    win.webContents.on('crashed', () => {
      dialog.showErrorBox('Crash', 'The program has crashed');
      console.error('The browser window has just crashed');
      app.quit();
    });

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('hello');
    });

    return win;
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (!mainWindow) {
      mainWindow = createMainWindow();
    }
  });

  app.on('ready', () => {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;

    if (browserConfig.width == 0 || browserConfig.height == 0) {
      browserConfig.width = width;
      browserConfig.height = height;
    }

    Menu.setApplicationMenu(createMenu());
    mainWindow = createMainWindow();

    // Manage automatic updates
    // try {
    //   require( './lib/auto-update/update' )( {
    //     url: ( pjson.config.update ) ? pjson.config.update.url || false : false,
    //     version: app.getVersion()
    //   } );
    //   ipc.on( 'update-downloaded', autoUpdater => {
    //     // Elegant solution: display unobtrusive notification messages
    //     mainWindow.webContents.send( 'update-downloaded' );
    //     ipc.on( 'update-and-restart', () => {
    //       autoUpdater.quitAndInstall();
    //     } );
    //
    //     // Basic solution: display a message box to the user
    //     // var updateNow = dialog.showMessageBox(mainWindow, {
    //     //   type: 'question',
    //     //   buttons: ['Yes', 'No'],
    //     //   defaultId: 0,
    //     //   cancelId: 1,
    //     //   title: 'Update available',
    //     //   message: 'There is an update available, do you want to restart and install it now?'
    //     // })
    //     //
    //     // if (updateNow === 0) {
    //     //   autoUpdater.quitAndInstall()
    //     // }
    //   } );
    // } catch ( e ) {
    //   console.error( e.message );
    //   dialog.showErrorBox( 'Update Error', e.message );
    // }
  });

  app.on('will-quit', () => { });

  ipc.on('open-info-window', () => {
    if (infoWindow) {
      return;
    }
    infoWindow = new electron.BrowserWindow({
      width: 600,
      height: 600,
      resizable: false
    });
    infoWindow.loadURL(`file://${__dirname}/info.html`);

    infoWindow.on('closed', () => {
      infoWindow = null;
    });
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
//
/**
 * [makeSingleInstance description]
 * @return {[type]} [description]
 */
function makeSingleInstance() {
  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}

/**
 * [createMenu description]
 * @return {[type]} [description]
 */
function createMenu() {
  return Menu.buildFromTemplate(require('./lib/menu'));
}
//
// // Manage Squirrel startup event (Windows)
// require( './lib/auto-update/startup' )( initialize );
initialize();
