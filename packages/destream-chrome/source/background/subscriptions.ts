// #region imports
    // #region internal
    import messagerManager from './messager';
    // #endregion internal
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

        messagerManager.get().subscribe<{data: any}>(
            id,
            (message) => {
                console.log('start destream session', message);

                // create event stream based on message.sessionID
                // start listening for messager events by sessionID
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
