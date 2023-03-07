export const getYoutubeVideoPlayer = () => {
    return document.getElementsByClassName('video-stream html5-main-video')[0];
}

export const getYoutubeLikeButton = (): HTMLButtonElement | undefined => {
    return document.querySelector('#segmented-like-button button');
}

export const checkYoutubeLikeButtonPressed = (
    button: HTMLButtonElement,
) => {
    return button.getAttribute('aria-pressed') === 'true';
}


export const youtubePlayPause = () => {
    console.log('youtubePlayStop');

    const evt = new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        keyCode: 75,
    });

    window.document.dispatchEvent(evt);
}


export const youtubeMute = () => {
    console.log('youtubeMute');

    const evt = new KeyboardEvent('keydown', {
        key: 'm',
        code: 'KeyM',
        keyCode: 77,
    });

    window.document.dispatchEvent(evt);
}


export const youtubeLike = () => {
    console.log('youtubeLike');

    const button = getYoutubeLikeButton();
    if (!button) {
        return;
    }

    if (checkYoutubeLikeButtonPressed(button)) {
        return;
    }

    button.click();
}


export const youtubeSeek = (
    seconds: number,
) => {
    console.log('youtubeSeek', seconds);

    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }
    (videoPlayer as any).currentTime = seconds;
}
