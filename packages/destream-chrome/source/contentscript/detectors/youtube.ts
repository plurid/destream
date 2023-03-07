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

        while (!this.video) {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.video = getYoutubeVideoPlayer() as HTMLVideoElement;
        }
        this.video.addEventListener('play', this.onPlay.bind(this));
        this.video.addEventListener('pause', this.onPause.bind(this));
        this.video.addEventListener('seeked', this.onSeek.bind(this));
        this.video.addEventListener('volumechange', this.onVolumeChange.bind(this));
        this.video.addEventListener('ratechange', this.onRateChange.bind(this));

        while (!this.likeButton) {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.likeButton = getYoutubeLikeButton();
        }
        this.likeButton.addEventListener('click', this.onLike.bind(this));
    }

    private onPlay() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: 'youtubePlay' },
        });
        this.target.dispatchEvent(event);
    }

    private onPause() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: 'youtubePause' },
        });
        this.target.dispatchEvent(event);
    }

    private onSeek() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: 'youtubeSeek', payload: this.video.currentTime },
        });
        this.target.dispatchEvent(event);
    }

    private onVolumeChange() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: 'youtubeVolumeChange', payload: this.video.volume },
        });
        this.target.dispatchEvent(event);
    }

    private onRateChange() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: 'youtubeRateChange', payload: this.video.playbackRate },
        });
        this.target.dispatchEvent(event);
    }

    private onLike() {
        if (!checkYoutubeLikeButtonPressed(this.likeButton)) {
            return;
        }

        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: 'youtubeLike' },
        });
        this.target.dispatchEvent(event);
    }
}
// #endregion module
