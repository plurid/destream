// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
        DestreamScrollEvent,
        DestreamCursorEvent,
    } from '../../../data';

    import {
        debounce,
        throttle,
    } from '../../../common/utilities';

    import {
        SCROLL_DEBOUNCE,
        CURSOR_THROTTLE,
    } from '../../data';

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

        const x = parseFloat((pageX / window.innerWidth * 100).toFixed(2));
        const y = parseFloat((pageY / window.innerHeight * 100).toFixed(2));

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


    public getCurrentState() {
        return {
            // url: window.location.href,
        };
    }
}
// #endregion module
