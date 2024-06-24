require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('node:child_process');
const { platform, homedir } = require('node:os');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    minWidth: 850,
    height: 800,
    maxHeight: 1010,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false);
};

app.whenReady().then(() => {
  ipcMain.handle('get-home-dir', () => homedir());
  ipcMain.handle('get-platform', () => process.platform);
  ipcMain.handle('get-env', () => process.env.ENV);
  ipcMain.handle('get-spotify-test-vars', () => ({
    trackUrl: process.env.EXAMPLE_TRACK_URL,
    username: process.env.SPOTIFY_USERNAME,
    password: process.env.SPOTIFY_PASSWORD
  }));
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('spawn-zotify', (event, args) => {
  return new Promise((resolve, reject) => {
    const zotifyInstance = spawn('zotifyy', args,
      platform() === 'win32' ? { // Prevents encoding error on windows, occurs when Zotify runs as a child and prints to terminal
        env: { PYTHONIOENCODING: 'utf-8' }
      } : {}
    );

    let STDOUT = '';
    let STDERR = '';

    zotifyInstance.stdout.on('data', (data) => {
      STDOUT += data;
    });
    zotifyInstance.stderr.on('data', (data) => {
      STDERR += data;
    });

    zotifyInstance.on('close', (code) => {
      if (code !== 0) {
        resolve(['Error', code]); // not using reject because I can't get the values in main.js
      }
      let status = 'Unknown';

      if (STDOUT.includes('Downloaded')) {
        status = 'Downloaded';
      } else if (STDOUT.includes('SKIPPING')) {
        status = 'SKIPPING';
      }

      resolve([
        status,
        {
          stdout: STDOUT.replace(/\s+/g, ' '),
          stderr: STDERR.replace(/\s+/g, ' '),
        }
      ]);
    });

    zotifyInstance.on('error', (err) => {
      resolve(['Error', err]); // not using reject because I can't get the values in main.js
    });
  });
});