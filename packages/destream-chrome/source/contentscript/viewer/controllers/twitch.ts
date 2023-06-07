// #region imports
    // #region external
    import {
        TwitchCurrentState,
    } from '../../../data';

    import {
        log,
    } from '../../../common/utilities';

    import {
        getTwitchVideoPlayer,
    } from '../../utilities/twitch';
    // #endregion external
// #endregion imports



// #region module
export const twitchPlay = () => {
    try {
        const videoPlayer = getTwitchVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.play()
            .catch(error => log(error));
    } catch (error) {
        log(error);
    }
}

export const twitchPause = () => {
    try {
        const videoPlayer = getTwitchVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.pause();
    } catch (error) {
        log(error);
    }
}

export const twitchRateChange = (
    rate: number,
) => {
    try {
        const videoPlayer = getTwitchVideoPlayer();
        if (!videoPlayer) {
            return;
        }
        videoPlayer.playbackRate = rate;
    } catch (error) {
        log(error);
    }
}

export const twitchVolumeChange = (
    volume: number,
) => {
    try {
        const videoPlayer = getTwitchVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.volume = volume;
    } catch (error) {
        log(error);
    }
}

export const twitchSeek = (
    seconds: number,
) => {
    try {
        const videoPlayer = getTwitchVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.currentTime = seconds;
    } catch (error) {
        log(error);
    }
}

export const twitchApplyCurrentState = (
    state: TwitchCurrentState,
) => {
    try {
        if (location.href !== state.url) {
            location.href = state.url;
            return;
        }

        const videoPlayer = getTwitchVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        const loadState = () => {
            twitchSeek(state.video.currentTime);
            twitchVolumeChange(state.video.volume);
            twitchRateChange(state.video.playbackRate);

            setTimeout(() => {
                if (state.video.paused) {
                    twitchPause();
                } else {
                    twitchPlay();
                }
            }, 200);

            if (document.hidden) {
                videoPlayer.removeEventListener('play', loadState);
            }
        }

        if (document.hidden) {
            videoPlayer.addEventListener('play', loadState);
        } else {
            setTimeout(() => {
                loadState();
            }, 500);
        }
    } catch (error) {
        log(error);
    }
}
// #endregion module
