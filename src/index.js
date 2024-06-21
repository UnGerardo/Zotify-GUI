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
};

app.whenReady().then(() => {
  ipcMain.handle('get-home-dir', () => homedir());
  ipcMain.handle('get-platform', () => process.platform);
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
    const zotifyInstance = spawn('zotify', args,
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
      reject(['Error', err]);
    });
  });
});