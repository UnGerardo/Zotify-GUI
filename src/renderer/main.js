
$runZotifyBtn.addEventListener('click', async () => {
  const spotifyUrl = $spotifyUrl.value;
  const username = $username.value;
  const password = $password.value;
  const output = $output.value;
  const songArchive = $songArchive.value;
  const rootPath = $rootPath.value;
  const rootPodcastPath = $rootPodcastPath.value;
  const splitAlbumDiscs = $splitAlbumDiscs.value;
  const downloadLyrics = $downloadLyrics.value;
  const mdAllGenres = $mdAllGenres.value;
  const mdGenreDelimiter = $mdGenreDelimiter.value;
  const downloadFormat = $downloadFormat.value;
  const downloadQuality = $downloadQuality.value;
  const transcodeBitrate = $transcodeBitrate.value;
  const skipExisting = $skipExisting.value;
  const skipPreviouslyDownloaded = $skipPreviouslyDownloaded.value;
  const retryAttempts = $retryAttempts.value;
  const bulkWaitTime = $bulkWaitTime.value;
  const overrideAutoWait = $overrideAutoWait.value;
  const chunkSize = $chunkSize.value;
  const downloadRealTime = $downloadRealTime.value;
  const language = $language.value;
  const tempDownloadDir = $tempDownloadDir.value;

  if (spotifyUrl === '') {
    $renderDownload('Error', 'No track URL provided.', 'Error');
    return;
  }

  if (username === '' || password === '') {
    $renderDownload('Error', 'Username or password not provided.', 'Error');
    return;
  }

  const args = [
    spotifyUrl,
    '--save-credentials=False',
    `--username=${username}`,
    `--password=${password}`,
    `--output=${output}`,
    `--root-path=${rootPath}`,
    `--root-podcast-path=${rootPodcastPath}`,
    `--split-album-discs=${splitAlbumDiscs}`,
    `--download-lyrics=${downloadLyrics}`,
    `--md-allgenres=${mdAllGenres}`,
    `--md-genredelimiter=${mdGenreDelimiter}`,
    `--download-format=${downloadFormat}`,
    `--download-quality=${downloadQuality}`,
    `--transcode-bitrate=${transcodeBitrate}`,
    `--skip-existing=${skipExisting}`,
    `--skip-previously-downloaded=${skipPreviouslyDownloaded}`,
    `--retry-attempts=${retryAttempts}`,
    `--bulk-wait-time=${bulkWaitTime}`,
    `--override-auto-wait=${overrideAutoWait}`,
    `--chunk-size=${chunkSize}`,
    `--download-real-time=${downloadRealTime}`,
    `--language=${language}`,
    '--print-downloads=True',
  ];

  if (songArchive.value) {
    args.push(`--song-archive=${songArchive}`);
  }
  if (tempDownloadDir.value) {
    args.push(`--temp-download-dir=${tempDownloadDir}`);
  }

  const [ status, zotify ] = await window.electronAPI.spawnZotify(args);

  switch(status) {
    case 'Downloaded': {
      const temp = zotify['stdout'].split('Downloaded "')[1];
      const endIndex = temp.indexOf('" to ');
      const trackInfo = temp.substring(0, endIndex);

      const [artistName, trackName] = trackInfo.split(' - ');
      $renderDownload(trackName, artistName, status);
      break;
    }
    case 'SKIPPING': {
      const temp = zotify['stdout'].split('SKIPPING: ')[1];
      const endIndex = temp.indexOf('(SONG ALREADY EXISTS)');
      const trackInfo = temp.substring(0, endIndex - 1);

      const [artistName, trackName] = trackInfo.split(' - ');
      $renderDownload(trackName, artistName, status);
      break;
    }
    default:
      $renderDownload(status, zotify['stderr'], status);
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