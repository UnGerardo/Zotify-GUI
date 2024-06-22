const $spotifyUrl = document.querySelector('input[name="spotify-url"]');
const $runZotifyBtn = document.getElementById('runZotify');

const $username = document.querySelector('input[name="username"]');
const $password = document.querySelector('input[name="password"]');
const $output = document.querySelector('input[name="output"]');
const $songArchive = document.querySelector('input[name="song-archive"]');
const $rootPath = document.querySelector('input[name="root-path"]');
const $rootPodcastPath = document.querySelector('input[name="root-podcast-path"]');
const $splitAlbumDiscs = document.querySelector('select[name="split-album-discs"]');
const $downloadLyrics = document.querySelector('select[name="download-lyrics"]');
const $mdAllGenres = document.querySelector('select[name="md-allgenres"]');
const $mdGenreDelimiter = document.querySelector('input[name="md-genredelimiter"]');
const $downloadFormat = document.querySelector('select[name="download-format"]');
const $downloadQuality = document.querySelector('select[name="download-quality"]');
const $transcodeBitrate = document.querySelector('input[name="transcode-bitrate"]');
const $skipExisting = document.querySelector('select[name="skip-existing"]');
const $skipPreviouslyDownloaded = document.querySelector('select[name="skip-previously-downloaded"]');
const $retryAttempts = document.querySelector('input[name="retry-attempts"]');
const $bulkWaitTime = document.querySelector('input[name="bulk-wait-time"]');
const $overrideAutoWait = document.querySelector('select[name="override-auto-wait"]');
const $chunkSize = document.querySelector('input[name="chunk-size"]');
const $downloadRealTime = document.querySelector('select[name="download-real-time"]');
const $language = document.querySelector('select[name="language"]');
const $tempDownloadDir = document.querySelector('input[name="temp-download-dir"]');

const $downloads = document.getElementById('downloads');