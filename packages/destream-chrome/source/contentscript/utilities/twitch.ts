// #region imports
    // #region external
    import {
        origins,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export const getTwitchVideoPlayer = (): HTMLVideoElement | undefined => {
    return document.querySelector('.video-ref video') as HTMLVideoElement | undefined;
}


export const checkTwitchOrigin = () => {
    return window.location.origin === origins.twitch;
}
// #endregion module
