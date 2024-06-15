import { app, BrowserWindow } from 'electron';
import { isDev } from 'electron-is-dev';
import { path, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';

let currentDir = dirname(fileURLToPath(import.meta.url));
currentDir = platform() === 'win32' ?
  dirname(fileURLToPath(import.meta.url)).split('\\') :
  dirname(fileURLToPath(import.meta.url)).split('/');
currentDir.pop();
const __dirname = currentDir.join('/');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../build/index.html')}`);
}

app.whenReady().then(() => {
  createWindow();
});