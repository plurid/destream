// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';
    // #endregion external


    // #region internal
    import runViewer from './viewer';
    import runStreamer from './streamer';
    // import injectView from './view';

    import {
        getSession,
        getTabID,
    } from './messaging';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        // const chromeRuntimePort = chrome.runtime.connect();

        const viewerCleanup = await runViewer();
        const streamerCleanup = await runStreamer();

        const tabID = await getTabID();
        const session = await getSession(tabID);

        if (session) {
            // check if there is an active session
            // inject view if active
            // injectView();
        }

        // chromeRuntimePort.onDisconnect.addListener(() => {
        //     viewerCleanup();
        //     streamerCleanup();
        // });
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
