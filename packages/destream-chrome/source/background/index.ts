// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';

    import {
        messageAddListener,
    } from '../common/messaging';

    import {
        tabsOnRemovedAddListener,
        tabsOnUpdatedAddListener,
    } from '../common/tab';
    // #endregion external


    // #region internal
    import {
        initialize,
    } from './general';

    import messageHandler from './handlers';

    import {
        stopSessionWithTabID,
        updateSession,
    } from './sessions';

    import {
        stopSubscriptionWithTabID,
    } from './subscriptions';

    import {
        stopReplaymentWithTabID,
    } from './replayments';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        initialize();

        messageAddListener((request, sender, sendResponse) => {
            messageHandler(request, sender, sendResponse)
                .catch(error => {
                    log(error);
                });

            // Indicate the response is asynchronous.
            return true;
        });

        tabsOnRemovedAddListener((tabID) => {
            stopSessionWithTabID(tabID).catch(error => {
                log(error);
            });
            stopSubscriptionWithTabID(tabID).catch(error => {
                log(error);
            });
            stopReplaymentWithTabID(tabID).catch(error => {
                log(error);
            });
        });

        tabsOnUpdatedAddListener(updateSession);
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
