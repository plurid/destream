// #region module
export const getSpotifyPlayButton = () => {
    const button = document.querySelector('button[data-testid="control-button-playpause"]');

    return button as HTMLButtonElement;
}


export const checkSpotifyOrigin = () => {
    return window.location.origin === 'https://open.spotify.com';
}
// #endregion module
