const { app, BrowserWindow, ipcMain } = require('electron');
const { spawnSync } = require('node:child_process');
const { platform } = require('node:os');
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
  console.log(`Spawning zotify with arg: ${args}`);

  const zotifyInstance = spawnSync('zotify', args,
    platform() === 'win32' ? { // Prevents encoding error on windows, occurs when Zotify runs as a child and prints to terminal
      env: { PYTHONIOENCODING: 'utf-8' }
    } : {}
  );

  if (zotifyInstance.error) {
    const ERROR = new TextDecoder().decode(zotifyInstance.error.message).replace(/\s+/g, ' ');
    console.log(`Error: ${ERROR}`);
    return ['Error', ERROR];
  } else {
    const STDOUT = new TextDecoder().decode(zotifyInstance.stdout).replace(/\s+/g, ' ');
    const STDERR = new TextDecoder().decode(zotifyInstance.stderr).replace(/\s+/g, ' ');
    const STATUS = zotifyInstance.status;

    console.log(`STDOUT: \n${STDOUT}`);
    console.log(`STDERR: \n${STDERR}`);
    console.log(`STATUS: ${STATUS}`);

    if (STDOUT.includes('Downloaded')) {
      return ['Downloaded', STDOUT];
    }
    else if (STDOUT.includes('SKIPPING')) {
      return ['SKIPPING', STDOUT];
    }
    else {
      return ['Error', STDERR];
    }
  }
});