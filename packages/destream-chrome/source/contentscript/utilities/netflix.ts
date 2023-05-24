// #region imports
    // #region external
    import {
        origins,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
export const getNetflixPlayButton = () => {
    const button = document.querySelector('button');

    return button as HTMLButtonElement;
}


export const checkNetflixOrigin = () => {
    return window.location.origin === origins.netflix;
}
// #endregion module
