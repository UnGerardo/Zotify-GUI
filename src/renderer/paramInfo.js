const PARAM_INFO = [
  ['spotify_url', 'The url to download.'],
  ['username', 'The Spotify username to use.'],
  ['password', 'The Spotify password to use.'],
  ['output', 'The output format of a downloaded song. Ex: "{artist}/{album}/{album_num} - {artist} - {song_name}.{ext}"'],
  ['song_archive', 'The song_archive file for SKIP_PREVIOUSLY_DOWNLOADED.'],
  ['root_path', 'Directory where Zotify saves music.'],
  ['root_podcast_path', 'Directory where Zotify saves podcasts.'],
  ['split_album_discs', 'Saves each disk in its own folder.'],
  ['download_lyrics', 'Downloads synced lyrics in .lrc format, uses unsynced as fallback.'],
  ['md_all_genres', 'Save all relevant genres in metadata.'],
  ['md_genre_delimiter', 'Delimiter character used to split genres in metadata.'],
  ['download_format', 'The download audio format (aac, fdk_aac, m4a, mp3, ogg, opus, vorbis).'],
  ['download_quality', 'Audio quality of downloaded songs (normal, high, very_high*). (*very-high is limited to premium only)'],
  ['transcode_bitrate', 'Overwrite the bitrate for ffmpeg encoding.'],
  ['skip_existing', 'Skip songs with the same name.'],
  ['skip_previously_downloaded', 'Use a song_archive file to skip previously downloaded songs.'],
  ['retry_attempts', 'Number of times Zotify will retry a failed request.'],
  ['bulk_wait_time', 'The wait time between bulk downloads.'],
  ['override_auto_wait', 'Totally disable wait time between songs with the risk of instability.'],
  ['chunk_size', 'Chunk size for downloading.'],
  ['download_real_time', 'Downloads songs as fast as they would be played, should prevent account bans.'],
  ['language', 'Language for spotify metadata.'],
  ['temp_download_dir', 'Download tracks to a temporary directory first.']
];

const $infoImgs = document.querySelectorAll('img[src="../icons/info.png"]');

for (let i = 0; i < $infoImgs.length; i++) {
  const infoPopup = document.createElement('p');
  infoPopup.classList.add('info-pop-up');
  infoPopup.innerText = PARAM_INFO[i][1];
  infoPopup.style.display = 'none';

  $infoImgs[i].parentElement.appendChild(infoPopup);

  $infoImgs[i].addEventListener('mouseover', () => {
    const imgRect = $infoImgs[i].getBoundingClientRect();
    infoPopup.style.top = `${imgRect.y + 30}px`;
    infoPopup.style.left = `${imgRect.x}px`;
    infoPopup.style.display = 'block';
  });
  $infoImgs[i].addEventListener('mouseout', () => {
    infoPopup.style.display = 'none';
  });
}
