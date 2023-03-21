// #region imports
    // #region external
    import {
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
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

            const event = new CustomEvent(DESTREAM_DETECT_EVENT, {
                detail: {
                    type: GENERAL_EVENT.SCROLL,
                    data: {
                        top: scrollX,
                        left: scrollY,
                    },
                },
            });

            this.target.dispatchEvent(event);
        });
    }
}
// #endregion module
