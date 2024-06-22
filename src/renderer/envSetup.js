
async function envSetup() {
  const env = await window.electronAPI.env();

  if (env === 'test') {
    const vars = await window.electronAPI.spotifyTestVars();

    $spotifyUrl.value = vars['trackUrl'];
    $username.value = vars['username'];
    $password.value = vars['password'];

    $runZotifyBtn.click();
  }
}

envSetup();