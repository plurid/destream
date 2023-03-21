// #region imports
    // #region external
    import {
        getSpotifyPlayButton,
    } from '../utilities/spotify';
    // #endregion external
// #endregion imports



// #region module
export const spotifyPlayPause = () => {
    const button = getSpotifyPlayButton();

    button.click();
}


export const spotifyMute = () => {
}


export const spotifySeek = (
    seconds: number,
) => {
}
// #endregion module
