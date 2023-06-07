// #region imports
    // #region external
    import {
        NetflixCurrentState,
    } from '../../../data';

    import {
        log,
    } from '../../../common/utilities';

    import {
        getNetflixVideoPlayer,
    } from '../../utilities/netflix';
    // #endregion external
// #endregion imports



// #region module
export const netflixPlay = () => {
    try {
        const videoPlayer = getNetflixVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.play()
            .catch(error => log(error));
    } catch (error) {
        log(error);
    }
}

export const netflixPause = () => {
    try {
        const videoPlayer = getNetflixVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.pause();
    } catch (error) {
        log(error);
    }
}

export const netflixRateChange = (
    rate: number,
) => {
    try {
        const videoPlayer = getNetflixVideoPlayer();
        if (!videoPlayer) {
            return;
        }
        videoPlayer.playbackRate = rate;
    } catch (error) {
        log(error);
    }
}

export const netflixVolumeChange = (
    volume: number,
) => {
    try {
        const videoPlayer = getNetflixVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.volume = volume;
    } catch (error) {
        log(error);
    }
}

export const netflixSeek = (
    seconds: number,
) => {
    try {
        const videoPlayer = getNetflixVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.currentTime = seconds;
    } catch (error) {
        log(error);
    }
}

export const netflixApplyCurrentState = (
    state: NetflixCurrentState,
) => {
    try {
        if (location.href !== state.url) {
            location.href = state.url;
            return;
        }

        const videoPlayer = getNetflixVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        const loadState = () => {
            netflixSeek(state.video.currentTime);
            netflixVolumeChange(state.video.volume);
            netflixRateChange(state.video.playbackRate);

            setTimeout(() => {
                if (state.video.paused) {
                    netflixPause();
                } else {
                    netflixPlay();
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
