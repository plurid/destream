// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
        DestreamScrollEvent,
    } from '../../../data';

    import {
        debounce,
    } from '../../../common/utilities';
    // #endregion external
// #endregion imports



// #region module
export interface Detector {
    target: EventTarget;
}


export class GeneralDetector implements Detector {
    private scrollHash: string = '';


    public target: EventTarget;


    constructor() {
        this.target = new EventTarget();

        this.generalInitialize();
    }


    private generalInitialize() {
        this.onGeneralScroll();
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

        const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
            detail: scrollEvent,
        });

        this.target.dispatchEvent(event);
    }, 600);

    protected onGeneralScroll() {
        window.addEventListener('scroll', this.scrollFunction.bind(this));
    }
}
// #endregion module
