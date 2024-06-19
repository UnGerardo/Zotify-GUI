
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

  switch(zotifyOutput[0]) {
    case 'Downloaded': {
      const temp = zotifyOutput[1].split('Downloaded "')[1];
      const endIndex = temp.indexOf('" to ');
      const trackInfo = temp.substring(0, endIndex - 1);

      const [artistName, trackName] = trackInfo.split(' - ');
      break;
    }
    case 'SKIPPING': {
      const temp = zotifyOutput[1].split('SKIPPING: ')[1];
      const endIndex = temp.indexOf('(SONG ALREADY EXISTS)');
      const trackInfo = temp.substring(0, endIndex - 1);

      const [artistName, trackName] = trackInfo.split(' - ');
      break;
    }
    default:
      console.log('Error, something went wrong');
      console.log(zotifyOutput[0]);
      console.log(zotifyOutput[1]);
  }
});