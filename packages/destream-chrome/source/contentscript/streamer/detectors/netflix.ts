// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        NETFLIX_EVENT,
    } from '../../../data';

    import {
        retryGet,
        debounce,
    } from '../../../common/utilities';

    import {
        getNetflixVideoPlayer,
        checkNetflixOrigin,
    } from '../../utilities/netflix';
    // #endregion external


    // #region internal
    import {
        GeneralDetector,
    } from './index';
    // #endregion internal
// #endregion imports



// #region module
export class NetflixDetector extends GeneralDetector {
    private video: HTMLVideoElement | undefined;


    constructor() {
        super();

        this.video = getNetflixVideoPlayer() as HTMLVideoElement;
        this.initialize();
    }


    private async initialize() {
        if (!checkNetflixOrigin()) {
            return;
        }

        if (!this.video) {
            this.video = await retryGet(getNetflixVideoPlayer);
            if (!this.video) {
                return;
            }
        }
        this.video.addEventListener('play', this.onPlay.bind(this));
        this.video.addEventListener('pause', this.onPause.bind(this));
        this.video.addEventListener('seeked', this.onSeek.bind(this));
        this.video.addEventListener('volumechange', debounce(this.onVolumeChange.bind(this)));
        this.video.addEventListener('ratechange', this.onRateChange.bind(this));
    }

    private onPlay() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: NETFLIX_EVENT.PLAY },
        });
        this.target.dispatchEvent(event);
    }

    private onPause() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: NETFLIX_EVENT.PAUSE },
        });
        this.target.dispatchEvent(event);
    }

    private onSeek() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: NETFLIX_EVENT.SEEK, payload: this.video.currentTime },
        });
        this.target.dispatchEvent(event);
    }

    private onVolumeChange() {
        const volume = this.video.muted ? 0 : this.video.volume;

        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: NETFLIX_EVENT.VOLUME_CHANGE, payload: volume },
        });
        this.target.dispatchEvent(event);
    }

    private onRateChange() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: NETFLIX_EVENT.RATE_CHANGE, payload: this.video.playbackRate },
        });
        this.target.dispatchEvent(event);
    }


    public getCurrentState() {
        return {
            url: window.location.href,
            video: {
                currentTime: this.video.currentTime,
                volume: this.video.muted ? 0 : this.video.volume,
                playbackRate: this.video.playbackRate,
                paused: this.video.paused,
            },
        };
    }
}
// #endregion module
