const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('node:child_process');
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

function spawnZotify(arg) {
  console.log(`From within spawnZotify: ${arg}`);
  const child = spawn('zotify', ['-h']);

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
  });
}

ipcMain.on('spawn-child-process', (event, arg) => {
  console.log(`Spawning process with arg: ${arg}`);
  spawnZotify(arg);
});