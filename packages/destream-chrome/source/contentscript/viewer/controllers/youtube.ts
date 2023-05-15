// #region imports
    // #region external
    import {
        YoutubeCurrentState,
    } from '../../../data';

    import {
        getYoutubeVideoPlayer,
        getYoutubeLikeButton,
        checkYoutubeLikeButtonPressed,
    } from '../../utilities/youtube';
    // #endregion external
// #endregion imports



// #region module
export const youtubePlay = () => {
    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }

    videoPlayer.play();
}

export const youtubePause = () => {
    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }

    videoPlayer.pause();
}

export const youtubePlayPause = () => {
    const evt = new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        keyCode: 75,
    });

    window.document.dispatchEvent(evt);
}

export const youtubeVolumeChange = (
    volume: number,
) => {
    if (volume === 0) {
        youtubeMute();
        return;
    }

    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }
    videoPlayer.volume = volume;
}

export const youtubeMute = () => {
    const evt = new KeyboardEvent('keydown', {
        key: 'm',
        code: 'KeyM',
        keyCode: 77,
    });

    window.document.dispatchEvent(evt);
}

export const youtubeLike = () => {
    const button = getYoutubeLikeButton();
    if (!button) {
        return;
    }

    if (checkYoutubeLikeButtonPressed(button)) {
        return;
    }

    button.click();
}

export const youtubeRateChange = (
    rate: number,
) => {
    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }
    videoPlayer.playbackRate = rate;
}

export const youtubeSeek = (
    seconds: number,
) => {
    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }

    videoPlayer.currentTime = seconds;
}

export const youtubeApplyCurrentState = (
    state: YoutubeCurrentState,
) => {
    const videoPlayer = getYoutubeVideoPlayer();
    if (!videoPlayer) {
        return;
    }

    if (state.video.paused) {
        youtubePause();
    } else {
        youtubePlay();
    }

    youtubeSeek(state.video.currentTime);
    youtubeVolumeChange(state.video.volume);
    youtubeRateChange(state.video.playbackRate);
}
// #endregion module
