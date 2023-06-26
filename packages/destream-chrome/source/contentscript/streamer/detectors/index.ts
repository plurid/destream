// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
        DestreamScrollEvent,
        DestreamCursorEvent,
    } from '~data/index';

    import {
        debounce,
        throttle,
    } from '~common/utilities';

    import {
        SCROLL_DEBOUNCE,
        CURSOR_THROTTLE,
    } from '../../data';

    import {
        checkVideoHandledByCustomDetector,
        getGeneralVideoPlayer,
    } from '../../utilities/general';

    import metadata from '../metadata';
    // #endregion external
// #endregion imports



// #region module
export interface Detector {
    target: EventTarget;

    getCurrentState: () => any;
}


export class GeneralDetector implements Detector {
    private scrollHash: string = '';
    private cursorHash: string = '';


    public target: EventTarget;


    constructor() {
        this.target = new EventTarget();

        this.generalInitialize();
    }


    private generalInitialize() {
        this.onGeneralScroll();
        this.onGeneralCursor();

        this.onGeneralVideo();
    }


    private scrollFunction = debounce(() => {
        const {
            scrollY,
            scrollX,
        } = window;

        const scrollEvent: DestreamScrollEvent = {
            type: GENERAL_EVENT.SCROLL,
            payload: {
                top: scrollY,
                left: scrollX,
            },
        };

        if (JSON.stringify(scrollEvent) === this.scrollHash) {
            // Prevent from sending multiple events with the same scroll data.
            return;
        }
        this.scrollHash = JSON.stringify(scrollEvent);

        const customEvent = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: scrollEvent,
        });

        this.target.dispatchEvent(customEvent);
    }, SCROLL_DEBOUNCE);

    protected onGeneralScroll() {
        window.addEventListener('scroll', this.scrollFunction.bind(this));
    }


    private cursorFunction = throttle((event: MouseEvent) => {
        if (metadata.getStreamCursor() === false) {
            return;
        }

        const {
            pageX,
            pageY,
        } = event;

        const x = parseFloat((pageX / window.innerWidth * 100).toFixed(4));
        const y = parseFloat((pageY / window.innerHeight * 100).toFixed(4));

        const cursorEvent: DestreamCursorEvent = {
            type: GENERAL_EVENT.CURSOR,
            payload: {
                x,
                y,
            },
        };

        if (JSON.stringify(cursorEvent) === this.cursorHash) {
            // Prevent from sending multiple events with the same cursor data.
            return;
        }
        this.scrollHash = JSON.stringify(cursorEvent);

        const customEvent = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: cursorEvent,
        });

        this.target.dispatchEvent(customEvent);
    }, CURSOR_THROTTLE);

    protected onGeneralCursor() {
        window.addEventListener('mousemove', this.cursorFunction.bind(this));
    }


    private handleGeneralVideo() {
        if (checkVideoHandledByCustomDetector()) {
            return;
        }

        const video = getGeneralVideoPlayer();
        if (!video) {
            return;
        }

        const videoOnPlay = () => {
            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: { type: GENERAL_EVENT.PLAY },
            });
            this.target.dispatchEvent(event);
        }

        const videoOnPause = () => {
            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: { type: GENERAL_EVENT.PAUSE },
            });
            this.target.dispatchEvent(event);
        }

        const videoOnSeek = () => {
            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: { type: GENERAL_EVENT.SEEK, payload: video.currentTime },
            });
            this.target.dispatchEvent(event);
        }

        const onVolumeChange = () => {
            const volume = video.muted ? 0 : video.volume;

            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: { type: GENERAL_EVENT.VOLUME_CHANGE, payload: volume },
            });
            this.target.dispatchEvent(event);
        }

        const onRateChange = () => {
            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: { type: GENERAL_EVENT.RATE_CHANGE, payload: video.playbackRate },
            });
            this.target.dispatchEvent(event);
        }

        video.addEventListener('play', videoOnPlay.bind(this));
        video.addEventListener('pause', videoOnPause.bind(this));
        video.addEventListener('seeked', videoOnSeek.bind(this));
        video.addEventListener('volumechange', debounce(onVolumeChange.bind(this)));
        video.addEventListener('ratechange', onRateChange.bind(this));
    }

    protected onGeneralVideo() {
        setTimeout(() => {
            this.handleGeneralVideo();
        }, 1_000);
    }


    public getCurrentState() {
        return {
            // url: window.location.href,
        };
    }
}
// #endregion module
