// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        SPOTIFY_EVENT,
    } from '~data/constants';

    import {
        retryGet,
        debounce,
    } from '~common/utilities';

    import {
        checkSpotifyOrigin
    } from '~contentscript/utilities/spotify';
    // #endregion external


    // #region internal
    import {
        GeneralDetector,
    } from './index';
    // #endregion internal
// #endregion imports



// #region module
export class SpotifyDetector extends GeneralDetector {
    constructor() {
        super();

        // this.audio = getSpotifyAudioPlayer();
        this.initialize();
    }


    private async initialize() {
    }


    private onPlay() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: SPOTIFY_EVENT.PLAY },
        });
        this.target.dispatchEvent(event);
    }

    private onPause() {
        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: { type: SPOTIFY_EVENT.PAUSE },
        });
        this.target.dispatchEvent(event);
    }

    // private onSeek() {
    //     const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
    //         detail: { type: SPOTIFY_EVENT.SEEK, payload: this.audio.currentTime },
    //     });
    //     this.target.dispatchEvent(event);
    // }

    // private onVolumeChange() {
    //     const volume = this.audio.muted ? 0 : this.audio.volume;

    //     const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
    //         detail: { type: SPOTIFY_EVENT.VOLUME_CHANGE, payload: volume },
    //     });
    //     this.target.dispatchEvent(event);
    // }


    public getCurrentState() {
        return {};
    }
}
// #endregion module
