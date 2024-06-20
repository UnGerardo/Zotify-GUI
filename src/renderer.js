
const $spotifyUrl = document.querySelector('input[name="spotify-url"]');
const $runZotifyBtn = document.getElementById('runZotify');

const $username = document.querySelector('input[name="username"]');
const $password = document.querySelector('input[name="password"]');

const $downloads = document.getElementById('downloads');

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

  const [ status, output ] = await window.electronAPI.spawnZotify(args);

  switch(status) {
    case 'Downloaded': {
      const temp = output['stdout'].split('Downloaded "')[1];
      const endIndex = temp.indexOf('" to ');
      const trackInfo = temp.substring(0, endIndex);

      const [artistName, trackName] = trackInfo.split(' - ');
      $renderDownload(trackName, artistName, status);
      break;
    }
    case 'SKIPPING': {
      const temp = output['stdout'].split('SKIPPING: ')[1];
      const endIndex = temp.indexOf('(SONG ALREADY EXISTS)');
      const trackInfo = temp.substring(0, endIndex - 1);

      const [artistName, trackName] = trackInfo.split(' - ');
      $renderDownload(trackName, artistName, status);
      break;
    }
    default:
      $renderDownload(status, output['stderr'], status);
  }
});

function $renderDownload(trackName, artistName, status) {
  const $download = document.createElement('section');
  $download.classList.add('download');

  const $flexCol = document.createElement('section');
  $flexCol.classList.add('flex-column');

  const $trackName = document.createElement('p');
  $trackName.innerText = trackName;
  const $artistName = document.createElement('p');
  $artistName.innerText = artistName;

  const iconNames = {
    'Downloaded': 'greenCheck.png',
    'SKIPPING': 'skipped.png',
    'Unknown': 'redX.png',
    'Error': 'redX.png'
  }

  const $icon = document.createElement('img');
  $icon.src = `../icons/${iconNames[status]}`;

  $flexCol.appendChild($trackName);
  $flexCol.appendChild($artistName);
  $download.appendChild($flexCol);
  $download.appendChild($icon);
  $downloads.insertBefore($download, $downloads.firstChild);
}