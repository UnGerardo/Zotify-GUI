
document.getElementById('b').addEventListener('click', async () => {
  const zotifyOutput = await window.electronAPI.spawnZotify('TRACK_URL');
  console.log(zotifyOutput);
});