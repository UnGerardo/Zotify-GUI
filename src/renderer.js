
const $spotifyUrl = document.querySelector('input[name="spotify-url"]');
const $username = document.querySelector('input[name="username"]');
const $password = document.querySelector('input[name="password"]');
const $runZotifyBtn = document.getElementById('runZotify');

$runZotifyBtn.addEventListener('click', async () => {
  const spotifyUrl = $spotifyUrl.value;
  const username = $username.value;
  const password = $password.value;

  const args = [
    spotifyUrl,
    `--username=${username}`,
    `--password=${password}`,
    '--print-downloads=True',
  ];

  const zotifyOutput = await window.electronAPI.spawnZotify(args);
  console.log(zotifyOutput);
});