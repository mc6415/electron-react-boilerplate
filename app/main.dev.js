/* eslint-disable no-undef */
/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { ConnectionPool } from 'mssql';
import User from './models/user';
import MenuBuilder from './menu';

const mongoose = require('mongoose');
const sql = require('mssql');

const bcrypt = require('bcrypt-nodejs');

const ipc = ipcMain;

const config = {
  user: 'sa',
  password: 'ir3ewkrmnldwm543dniwr',
  server: 'alto.alberon.co.uk',
  port: 2433,
  database: 'AppleReports',
  requestTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

mongoose.connect('mongodb://mcoombes:mcoombes@ds129386.mlab.com:29386/electronnotes', { useMongoClient: true });

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();
});

ipc.on('test', (event) => {
  const hash = bcrypt.hashSync('test');
  console.log(hash);
  console.log(bcrypt.compareSync('test', hash));
});

ipc.on('registerUser', (event, user) => {
  const hash = bcrypt.hashSync(user.password);

  const newUser = new User();

  newUser.username = user.username;
  newUser.lastsName = user.surname;
  newUser.email = user.email;
  newUser.firstName = user.firstname;
  newUser.password = bcrypt.hashSync(user.password);

  newUser.save();

  event.sender.send('UserAdded');
});

ipc.on('loginUser', (event, login) => {
  User.find({ username: login.username }, (err, docs) => {
    const user = docs[0];

    console.log(bcrypt.compareSync(login.password, user.password));
  });
});
