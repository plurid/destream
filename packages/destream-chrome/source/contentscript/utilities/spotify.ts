// #region imports
    // #region external
    import {
        origins,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
export const getSpotifyPlayButton = () => {
    const button = document.querySelector('button[data-testid="control-button-playpause"]');

    return button as HTMLButtonElement;
}


export const checkSpotifyOrigin = () => {
    return window.location.origin === origins.spotify;
}
// #endregion module
