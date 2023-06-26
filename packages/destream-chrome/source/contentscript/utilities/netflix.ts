// #region imports
    // #region external
    import {
        origins,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export const getNetflixVideoPlayer = (): HTMLVideoElement | undefined => {
    return document.querySelector('video') as HTMLVideoElement | undefined;
}


export const checkNetflixOrigin = () => {
    return window.location.origin === origins.netflix;
}
// #endregion module
