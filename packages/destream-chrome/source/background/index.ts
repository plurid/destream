// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';
    // #endregion external


    // #region internal
    import messageHandler from './handlers';
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
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
