// #region imports
    // #region external
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
// #endregion module
