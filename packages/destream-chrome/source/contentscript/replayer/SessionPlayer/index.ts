// #region imports
    // #region external
    import {
        log,
    } from '../../../common/utilities';

    import {
        handleEvent,
    } from '../../viewer/event';

    import {
        generateCursor,
        destroyCursor,
    } from '../../viewer/controllers/general';
    // #endregion external
// #endregion imports



// #region module
export interface SessionEvent {
    data: string;
    relativeTime: number;
}


export class SessionPlayer {
    private currentIndex = 0;
    private events: SessionEvent[];
    private atIndexUpdate: (index: number) => void;
    private timeouts: NodeJS.Timeout[] = [];

    constructor(
        sessionStart: number,
        events: SessionEvent[],
        atIndexUpdate: (index: number) => void,
    ) {
        this.events = events;
        this.atIndexUpdate = atIndexUpdate;

        generateCursor('');
    }


    private runEvent(
        event: SessionEvent,
        index: number,
    ) {
        try {
            this.atIndexUpdate(index);

            const data = JSON.parse(event.data);

            handleEvent(data);
        } catch (error) {
            log(error);
        }
    }

    private getPreviousTime(
        index: number,
    ) {
        if (index === 0) {
            return 0;
        }

        const previousEvent = this.events[index - 1];
        if (!previousEvent) {
            return 0;
        }

        return previousEvent.relativeTime;
    }


    public setIndex(
        index: number,
    ) {
        this.pause();

        if (index < 0) {
            this.currentIndex = 0;
        } else if (index > this.events.length) {
            this.currentIndex = this.events.length - 1;
        } else {
            this.currentIndex = index;
        }
    }

    public play(
        reset?: true,
    ) {
        if (reset) {
            this.currentIndex = 0;
        }

        const previousTime = this.getPreviousTime(this.currentIndex);

        for (const event of this.events.slice(this.currentIndex)) {
            const timeoutTime = event.relativeTime - previousTime;

            const timeout = setTimeout(() => {
                this.runEvent(event, this.currentIndex);
                this.currentIndex++;
            }, timeoutTime);

            this.timeouts.push(timeout);
        }
    }

    public pause() {
        for (const timeout of this.timeouts) {
            clearTimeout(timeout);
        }
    }

    public stop() {
        this.pause();

        destroyCursor();
    }
}
// #endregion module
