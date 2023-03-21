// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
        DestreamScrollEvent,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
export interface Detector {
    target: EventTarget;
}


export class GeneralDetector implements Detector {
    public target: EventTarget;

    constructor() {
        this.target = new EventTarget();
    }

    protected onGeneralScroll() {
        window.addEventListener('scroll', () => {
            const {
                scrollX,
                scrollY,
            } = window;

            const scrollEvent: DestreamScrollEvent = {
                type: GENERAL_EVENT.SCROLL,
                payload: {
                    top: scrollX,
                    left: scrollY,
                },
            };

            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: scrollEvent,
            });

            this.target.dispatchEvent(event);
        });
    }
}
// #endregion module
