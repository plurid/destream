// #region imports
    // #region external
    import messagerManager from '../messager';

    import {
        sessionManager,
    } from '../session';
    // #endregion external
// #endregion imports



// #region module
const getID = (identonym: string) => `destream-${identonym}`;


class SubscriptionManager {
    constructor() {

    }


    public async new(
        identonym: string,
    ) {
        const id = getID(identonym);

        messagerManager.get().subscribe<{type: string; data: any}>(
            id,
            (message) => {
                console.log('start stop destream session', message);

                // create event stream based on message.sessionID
                // start listening for messager events by sessionID

                switch (message.type) {
                    case 'start':
                        sessionManager.new(message.data);
                        break;
                    case 'stop':
                        sessionManager.stop(message.data);
                        break;
                }
            },
        );
    }

    public remove(
        identonym: string,
    ) {
        const id = getID(identonym);

        messagerManager.get().unsubscribe(id);
    }
}


const subscriptionManager = new SubscriptionManager();
// #endregion module



// #region exports
export default subscriptionManager;
// #endregion exports
