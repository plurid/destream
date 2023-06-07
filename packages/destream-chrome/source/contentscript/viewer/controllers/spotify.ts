// #region imports
    // #region external
    import {
        getSpotifyPlayButton,
    } from '../../utilities/spotify';
    // #endregion external
// #endregion imports



// #region module
export const spotifyPlayPause = () => {
    const button = getSpotifyPlayButton();

    button.click();
}

export const spotifyVolumeChange = (
    volume: number,
) => {
}

export const spotifySeek = (
    seconds: number,
) => {
}

export const spotifyApplyCurrentState = (
    state: any,
) => {
}
// #endregion module
