// #region imports
    // #region external
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
    // #endregion internal
// #endregion imports



// #region module
const main = () => {
    try {
        initialize();

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            messageHandler(request, sender, sendResponse)
                .catch(error => {
                    log(error);
                });

            // Indicate the response is asynchronous.
            return true;
        });

        chrome.tabs.onRemoved.addListener((tabID) => {
            stopSessionWithTabID(tabID);
            stopSubscriptionWithTabID(tabID);
            stopReplaymentWithTabID(tabID);
        });

        chrome.tabs.onUpdated.addListener(updateSession);
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
