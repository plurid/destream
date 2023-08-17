// #region imports
    // #region external
    import {
        checkNetflixOrigin,
    } from './netflix';

    import {
        checkTwitchOrigin,
    } from './twitch';

    import {
        checkYoutubeOrigin,
    } from './youtube';
    // #endregion external
// #endregion imports



// #region module
export const checkVideoHandledByCustomDetector = () => {
    if (checkNetflixOrigin()) return true;
    if (checkTwitchOrigin()) return true;
    if (checkYoutubeOrigin()) return true;

    return false;
}


export const getGeneralVideoPlayer = () => {
    try {
        const video = document.querySelector('video') as HTMLVideoElement | undefined;
        if (video) {
            return video;
        }

        const iframe = document.getElementsByTagName('iframe')[0];
        if (!iframe) {
            return;
        }

        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDocument) {
            return;
        }
        const iframeVideo = iframeDocument.getElementsByTagName('video')[0];
        return iframeVideo as HTMLVideoElement | undefined;;
    } catch (error) {
        return;
    }
}
// #endregion module
