// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';
    // #endregion external


    // #region internal
    import messageHandler from './handlers';

    import {
        stopSessionWithTabID,
    } from './sessions';

    import {
        stopSubscriptionWithTabID,
    } from './subscriptions';

    import update from './update';
    // #endregion internal
// #endregion imports



// #region module
const main = () => {
    try {
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
        });

        chrome.tabs.onUpdated.addListener(update);
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
