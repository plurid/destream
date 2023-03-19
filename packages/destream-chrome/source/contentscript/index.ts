// #region imports
    // #region internal
    import {
        runViewer,
    } from './viewer';

    import {
        runStreamer,
    } from './streamer';

    import {
        injectView,
    } from './view';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    runViewer();
    runStreamer();

    // get tab id
    // check if there is an active session
    // inject view if active

    // chrome.runtime.sendMessage({type: "getTabId"}, async (response) => {
    //     if (response) {
    //         var tabId = response.tabId;
    //         console.log("Tab ID: " + tabId);
    //     }
    // });

    // injectView();
}

main();
// #endregion module
