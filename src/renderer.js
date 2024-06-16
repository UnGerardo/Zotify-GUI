
document.getElementById('b').addEventListener('click', () => {
  window.electronAPI.spawnChildProcess('TRACK_URL');
});