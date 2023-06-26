// #region imports
    // #region external
    import {
        Handler,
        MessageStopEverything,
        ResponseMessage,

        storagePrefix,
    } from '~data/index';

    import {
        storageGetAll,
    } from '~common/storage';

    import {
        checkEverythingKey,
    } from '~common/logic';

    import {
        storageRemove,
    } from '~common/storage';

    import {
        getTabIDFromKey,
    } from '~common/utilities';

    import {
        getSession,
        stopSessionLogic,
    } from '../sessions';

    import {
        stopSubscriptionWithTabID,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleStopEverything: Handler<MessageStopEverything, ResponseMessage> = async (
    _request,
    _sender,
    sendResponse,
) => {
    const storage = await storageGetAll();

    Object.keys(storage).forEach(async (key) => {
        if (checkEverythingKey(key)) {
            if (key.startsWith(storagePrefix.session)) {
                const tabID = getTabIDFromKey(key, storagePrefix.session);
                const session = await getSession(tabID);
                await stopSessionLogic(session.id, tabID);
                return;
            }

            if (key.startsWith(storagePrefix.subscription)) {
                const tabID = getTabIDFromKey(key, storagePrefix.subscription);
                await stopSubscriptionWithTabID(tabID);
                return;
            }

            if (key.startsWith(storagePrefix.replayment)) {
                const tabID = getTabIDFromKey(key, storagePrefix.subscription);
                // stop replayment for tabID
                // return;
            }

            await storageRemove(key);
        }
    });

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopEverything;
// #endregion exports
