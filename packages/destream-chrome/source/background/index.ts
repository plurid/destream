// #region imports
    // #region internal
    import messageHandler from './handlers';

    import {
        log,
    } from './utilities';
    // #endregion internal
// #endregion imports



// #region module
const main = () => {
    try {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            messageHandler(request, sender, sendResponse);

            // Indicate the response is asynchronous.
            return true;
        });
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
