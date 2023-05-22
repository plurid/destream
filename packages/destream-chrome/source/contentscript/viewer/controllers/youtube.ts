// #region imports
    // #region external
    import {
        YoutubeCurrentState,
    } from '../../../data';

    import {
        log,
    } from '../../../common/utilities';

    import {
        getYoutubeVideoPlayer,
        getYoutubeLikeButton,
        checkYoutubeLikeButtonPressed,
    } from '../../utilities/youtube';
    // #endregion external
// #endregion imports



// #region module
export const youtubePlay = () => {
    try {
        const videoPlayer = getYoutubeVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.play();
    } catch (error) {
        log(error);
    }
}

export const youtubePause = () => {
    try {
        const videoPlayer = getYoutubeVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.pause();
    } catch (error) {
        log(error);
    }
}

export const youtubePlayPause = () => {
    try {
        const evt = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            keyCode: 75,
        });

        window.document.dispatchEvent(evt);
    } catch (error) {
        log(error);
    }
}

export const youtubeVolumeChange = (
    volume: number,
) => {
    try {
        if (volume === 0) {
            youtubeMute();
            return;
        }

        const videoPlayer = getYoutubeVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        if (videoPlayer.muted && volume === 1) {
            // unmute
            youtubeMute();
            return;
        }

        videoPlayer.volume = volume;
    } catch (error) {
        log(error);
    }
}

export const youtubeMute = () => {
    try {
        const evt = new KeyboardEvent('keydown', {
            key: 'm',
            code: 'KeyM',
            keyCode: 77,
        });

        window.document.dispatchEvent(evt);
    } catch (error) {
        log(error);
    }
}

export const youtubeLike = () => {
    try {
        const button = getYoutubeLikeButton();
        if (!button) {
            return;
        }

        if (checkYoutubeLikeButtonPressed(button)) {
            return;
        }

        button.click();
    } catch (error) {
        log(error);
    }
}

export const youtubeRateChange = (
    rate: number,
) => {
    try {
        const videoPlayer = getYoutubeVideoPlayer();
        if (!videoPlayer) {
            return;
        }
        videoPlayer.playbackRate = rate;
    } catch (error) {
        log(error);
    }
}

export const youtubeSeek = (
    seconds: number,
) => {
    try {
        const videoPlayer = getYoutubeVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.currentTime = seconds;
    } catch (error) {
        log(error);
    }
}

export const youtubeApplyCurrentState = (
    state: YoutubeCurrentState,
) => {
    try {
        const videoPlayer = getYoutubeVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        youtubeSeek(state.video.currentTime);
        youtubeVolumeChange(state.video.volume);
        youtubeRateChange(state.video.playbackRate);

        setTimeout(() => {
            if (state.video.paused) {
                youtubePause();
            } else {
                youtubePlay();
            }
        }, 500);
    } catch (error) {
        log(error);
    }
}
// #endregion module
