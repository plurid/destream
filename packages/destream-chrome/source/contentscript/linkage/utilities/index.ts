// #region module
export class Counter {
    private count: number = 0;
    private limit: number;
    private callback: () => void;
    private interval: NodeJS.Timer | undefined;

    constructor(
        limit: number,
        callback: () => void,
    ) {
        this.limit = limit;
        this.callback = callback;

        this.setInterval();
    }

    public setInterval() {
        this.interval = setInterval(() => {
            this.count += 1;

            if (this.count >= this.limit) {
                this.callback();

                if (this.interval) {
                    clearInterval(this.interval);
                }
            }
        }, 1_000);
    }

    public clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}


export interface EventHandle {
    type: string;
    data?: any;
}

export type EventListenerCallback = (event: EventHandle) => void;

export class EventListener {
    private listeners: Record<string, EventListenerCallback[]>;

    constructor() {
        this.listeners = {};
    }

    public addEventListener(
        eventType: string,
        handler: EventListenerCallback,
    ) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }

        this.listeners[eventType].push(handler);
    }

    public removeEventListener(
        eventType: string,
        handler: EventListenerCallback,
    ) {
        if (this.listeners[eventType]) {
            const index = this.listeners[eventType].indexOf(handler);
            if (index !== -1) {
                this.listeners[eventType].splice(index, 1);
            }
        }
    }

    public dispatchEvent<D = any>(
        eventType: string,
        data?: D,
    ) {
        if (this.listeners[eventType]) {
            const event: EventHandle = {
                type: eventType,
                data,
            };

            this.listeners[eventType].forEach(handler => handler(event));
        }
    }
}
// #endregion module
