// #region module
export interface SessionEvent {
    time: number;
}

export const directions = {
    forward: 'forward',
    backward: 'backward',
} as const;

export type Direction = typeof directions[keyof typeof directions];


export class SessionPlayer {
    private sessionStart;
    private currentIndex = 0;
    private timeoutID: NodeJS.Timeout | null = null;
    private events: SessionEvent[];
    private direction: Direction = directions.forward;


    constructor(
        sessionStart: number,
        events: SessionEvent[],
    ) {
        this.events = events;
        this.sessionStart = sessionStart;
    }


    private runEvent(
        event: SessionEvent,
    ) {
        // send event to tabid ?
    }

    private scheduleEvent(
        index: number,
    ) {
        const currentEvent = this.events[index];
        const currentTime = this.sessionStart + currentEvent.time;

        const timeDiff = currentTime - Date.now();
        if (timeDiff <= 0) {
            this.runEvent(currentEvent);
            this.playNextEvent();
        } else {
            this.timeoutID = setTimeout(() => {
                this.runEvent(currentEvent);
                this.playNextEvent();
            }, timeDiff);
        }
    }

    private playNextEvent() {
        if (this.direction === directions.forward) {
            this.currentIndex++;

            if (this.currentIndex < this.events.length) {
                this.scheduleEvent(this.currentIndex);
            } else {
                this.currentIndex = this.events.length - 1;
                this.direction = directions.backward;
            }
        } else {
            this.currentIndex--;

            if (this.currentIndex >= 0) {
                this.scheduleEvent(this.currentIndex);
            } else {
                this.currentIndex = 0;
                this.direction = directions.forward;
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
        if (index !== this.currentIndex) {
            this.currentIndex = index;
        }
    }

    public play() {
        if (this.timeoutID === null) {
            this.scheduleEvent(this.currentIndex);
        }
    }

    public pause() {
        if (this.timeoutID !== null) {
            clearTimeout(this.timeoutID);

            this.timeoutID = null;
        }
    }
}
// #endregion module
