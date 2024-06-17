const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

ipcMain.handle('spawn-zotify', (event, arg) => {
  console.log(`Spawning zotify with arg: ${arg}`);

  const zotifyInstance = spawnSync('zotify', ['-h']);

  if (zotifyInstance.error) {
    console.log(`Error: ${zotifyInstance.error.message}`);
    return new TextDecoder().decode(zotifyInstance.error.message);
  } else {
    console.log(`STDOUT: \n${zotifyInstance.stdout}`);
    console.log(`STDERR: \n${zotifyInstance.stderr}`);
    console.log(`STATUS: ${zotifyInstance.status}`);
    return new TextDecoder().decode(zotifyInstance.stdout);
  }
});