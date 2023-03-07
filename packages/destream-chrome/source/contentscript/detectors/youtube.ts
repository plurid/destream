// #region imports
    // #region external
    import {
        getYoutubeVideoPlayer,
        getYoutubeLikeButton,
        checkYoutubeLikeButtonPressed,
    } from '../controllers/youtube';
    // #endregion external


    // #region internal
    import {
        Detector,
    } from './index';
    // #endregion internal
// #endregion imports



// #region module
export const checkYoutubeOrigin = () => {
    return window.location.origin === 'https://www.youtube.com';
}

export const DESTREAM_DETECT_EVENT = 'destreamDetect';

export const YOUTUBE_EVENT = {
    PLAY: 'youtubePlay',
    PAUSE: 'youtubePause',
    SEEK: 'youtubeSeek',
    VOLUME_CHANGE: 'youtubeVolumeChange',
    RATE_CHANGE: 'youtubeRateChange',
    LIKE: 'youtubeLike',
};


export const retryGet = async <T>(
    getter: () => T | undefined,
) => {
    let retryCount = 0;

    while (!getter()) {
        retryCount += 1;

        await new Promise(resolve => setTimeout(resolve, 100));

        if (retryCount > 100) {
            return;
        }
    }

    return getter();
}


export class YoutubeDetector implements Detector {
    private video: HTMLVideoElement | undefined;
    private likeButton: HTMLButtonElement | undefined;

    public target: EventTarget;


    constructor() {
        this.target = new EventTarget();

        this.video = getYoutubeVideoPlayer() as HTMLVideoElement;
        this.likeButton = getYoutubeLikeButton();
        this.initialize();
    }


    private async initialize() {
        if (!checkYoutubeOrigin()) {
            return;
        }

        if (!this.video) {
            this.video = await retryGet(getYoutubeVideoPlayer);
            if (!this.video) {
                return;
            }
        }
        this.video.addEventListener('play', this.onPlay.bind(this));
        this.video.addEventListener('pause', this.onPause.bind(this));
        this.video.addEventListener('seeked', this.onSeek.bind(this));
        this.video.addEventListener('volumechange', this.onVolumeChange.bind(this));
        this.video.addEventListener('ratechange', this.onRateChange.bind(this));

        if (!this.likeButton) {
            this.likeButton = await retryGet(getYoutubeLikeButton);
            if (!this.likeButton) {
                return;
            }
        }
        this.likeButton.addEventListener('click', this.onLike.bind(this));
    }

    private onPlay() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: YOUTUBE_EVENT.PLAY },
        });
        this.target.dispatchEvent(event);
    }

    private onPause() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: YOUTUBE_EVENT.PAUSE },
        });
        this.target.dispatchEvent(event);
    }

    private onSeek() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: YOUTUBE_EVENT.SEEK, payload: this.video.currentTime },
        });
        this.target.dispatchEvent(event);
    }

    private onVolumeChange() {
        const volume = this.video.muted ? 0 : this.video.volume;

        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: YOUTUBE_EVENT.VOLUME_CHANGE, payload: volume },
        });
        this.target.dispatchEvent(event);
    }

    private onRateChange() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: YOUTUBE_EVENT.RATE_CHANGE, payload: this.video.playbackRate },
        });
        this.target.dispatchEvent(event);
    }

    private onLike() {
        if (!checkYoutubeLikeButtonPressed(this.likeButton)) {
            return;
        }

        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: YOUTUBE_EVENT.LIKE },
        });
        this.target.dispatchEvent(event);
    }
}
// #endregion module
