// #region imports
    // #region external
    import {
        log,
    } from '../../../common/utilities';

    import {
        handleEvent,
    } from '../../viewer';
    // #endregion external
// #endregion imports



// #region module
export interface SessionEvent {
    data: string;
    relativeTime: number;
}

export const directions = {
    forward: 'forward',
    backward: 'backward',
} as const;

export type Direction = typeof directions[keyof typeof directions];


export class SessionPlayer {
    private sessionStart;
    private sessionReplay;
    private currentIndex = 0;
    private timeoutID: NodeJS.Timeout | null = null;
    private events: SessionEvent[];
    private atIndexUpdate: (index: number) => void;
    private direction: Direction = directions.forward;
    private pauseTime: number | undefined;


    constructor(
        sessionStart: number,
        events: SessionEvent[],
        atIndexUpdate: (index: number) => void,
    ) {
        this.events = events;
        this.sessionStart = sessionStart;
        this.sessionReplay = Date.now();
        this.atIndexUpdate = atIndexUpdate;
    }


    private runEvent(
        event: SessionEvent,
        index: number,
    ) {
        console.log(
            event,
            index,
        );
        try {
            this.atIndexUpdate(index);

            const data = JSON.parse(event.data);

            handleEvent(data);
        } catch (error) {
            log(error);
        }
    }

    private scheduleEvent(
        index: number,
    ) {
        const currentEvent = this.events[index];
        const currentTime = this.sessionReplay + currentEvent.relativeTime;
        const timeDifference = currentTime - Date.now();
        console.log({
            currentTime,
            timeDifference,
            sessionReplay: this.sessionReplay,
        });

        if (timeDifference <= 0) {
            this.runEvent(currentEvent, index);
            this.playNextEvent();
        } else {
            this.timeoutID = setTimeout(() => {
                console.log('timeout', index);
                this.runEvent(currentEvent, index);
                this.playNextEvent();
            }, timeDifference);
        }
    }

    private playNextEvent() {
        if (this.direction === directions.forward) {
            this.currentIndex++;

            if (this.currentIndex < this.events.length) {
                this.scheduleEvent(this.currentIndex);
            } else {
                this.pause();
            }
        } else {
            this.currentIndex--;

            if (this.currentIndex >= 0) {
                this.scheduleEvent(this.currentIndex);
            } else {
                this.pause();
            }
        }
    }


    public setDirection(
        direction: Direction,
    ) {
        if (direction !== this.direction) {
            this.direction = direction;
            this.pause();

            if (direction === directions.forward) {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.events.length - 1;
            }
        }
    }

    public setIndex(
        index: number,
    ) {
        if (index < 0) {
            this.currentIndex = 0;
            return;
        }

        if (index > this.events.length) {
            this.currentIndex = this.events.length - 1;
            this.pause();
            return;
        }

        this.currentIndex = index;
    }

    public play(
        reset?: true,
    ) {
        if (typeof this.pauseTime === 'number') {
            const pauseDifference = Date.now() - this.pauseTime;
            console.log({
                pauseTime: this.pauseTime,
                pauseDifference,
            });
            this.sessionReplay += pauseDifference;
            this.pauseTime = undefined;
        }

        if (reset) {
            this.currentIndex = 0;
        }

        if (this.timeoutID === null) {
            this.scheduleEvent(this.currentIndex);
        }
    }

    public pause() {
        this.pauseTime = Date.now();

        if (this.timeoutID !== null) {
            clearTimeout(this.timeoutID);

            this.timeoutID = null;
        }
    }

    public stop() {
    }
}
// #endregion module
