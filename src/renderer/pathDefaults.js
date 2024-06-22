
async function pathDefaults() {
  const homeDir = await window.electronAPI.homedir();
  const platform = await window.electronAPI.platform;

  $rootPath.value = platform === 'win32' ? `${homeDir}\\Zotify_Music` : `${homeDir}/Zotify_Music`;
  $rootPodcastPath.value = platform === 'win32' ? `${homeDir}\\Zotify_Podcasts` : `${homeDir}/Zotify_Podcasts`;
}

pathDefaults();