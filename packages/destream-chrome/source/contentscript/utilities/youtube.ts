// #region module
export const getYoutubeVideoPlayer = (): HTMLVideoElement | undefined => {
    return document.getElementsByClassName('video-stream html5-main-video')[0] as HTMLVideoElement | undefined;
}

export const getYoutubeLikeButton = (): HTMLButtonElement | undefined => {
    return document.querySelector('#segmented-like-button button');
}

export const checkYoutubeLikeButtonPressed = (
    button: HTMLButtonElement,
) => {
    return button.getAttribute('aria-pressed') === 'true';
}


export const checkYoutubeOrigin = () => {
    return window.location.origin === 'https://www.youtube.com';
}
// #endregion module
