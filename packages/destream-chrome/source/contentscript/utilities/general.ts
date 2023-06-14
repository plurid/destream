// #region module
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

        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframeVideo = iframeDocument.getElementsByTagName('video')[0];
        return iframeVideo as HTMLVideoElement | undefined;;
    } catch (error) {
        return;
    }
}
// #endregion module
