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
// #endregion module
