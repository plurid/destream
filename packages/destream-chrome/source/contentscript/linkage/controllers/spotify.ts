// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        ReplaymentInitializeMessage,

        DestreamLinkage,
        DestreamLinkageSession,
    } from '../../../data';

    import {
        sendMessage,
    } from '../../../common/messaging';

    import {
        log,
    } from '../../../common/utilities';

    import {
        Counter,
        EventListener,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export class SpotifyLinkage {
    public data: DestreamLinkage;
    public eventer: EventListener;
    private counter: Counter | undefined;


    constructor(
        data: DestreamLinkage,
    ) {
        this.data = data;
        this.eventer = new EventListener();

        for (const session of data.sessions) {
            this.registerStarter(session);
        }
    }


    private registerStarter(
        session: DestreamLinkageSession,
    ) {

    }

    private async playLinkage(
        session: DestreamLinkageSession,
    ) {

    }


    public stop() {

    }
}
// #endregion module