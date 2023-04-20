// #region imports
    // #region internal
    import messageHandler from './handlers';
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
        console.log(error);
    }
}

main();
// #endregion module
