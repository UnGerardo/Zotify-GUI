// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
  spawnZotify: (arg) => ipcRenderer.invoke('spawn-zotify', arg),
  homedir: () => ipcRenderer.invoke('get-home-dir'),
  platform: () => ipcRenderer.invoke('get-platform'),
  env: () => ipcRenderer.invoke('get-env'),
  spotifyTestVars: () => ipcRenderer.invoke('get-spotify-test-vars'),
});