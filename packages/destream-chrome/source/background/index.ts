// #region imports
    // #region external
    import {
        ASYNCHRONOUS_RESPONSE,
    } from '../data';

    import {
        messageAddListener,
    } from '../common/messaging';

    import {
        tabsOnRemovedAddListener,
        tabsOnUpdatedAddListener,
    } from '../common/tab';

    import {
        log,
    } from '../common/utilities';
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

    import {
        stopLinkageWithTabID,
    } from './linkages';
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

            return ASYNCHRONOUS_RESPONSE;
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
            stopLinkageWithTabID(tabID).catch(error => {
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
