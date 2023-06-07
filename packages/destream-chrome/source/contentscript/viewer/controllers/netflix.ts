// #region imports
    // #region external
    import {
        getNetflixPlayButton,
    } from '../../utilities/netflix';
    // #endregion external
// #endregion imports



// #region module
export const netflixPlayPause = () => {
    const button = getNetflixPlayButton();

    button.click();
}

export const netflixVolumeChange = (
    volume: number,
) => {
}

export const netflixSeek = (
    seconds: number,
) => {
}

export const netflixApplyCurrentState = (
    state: any,
) => {
}
// #endregion module
