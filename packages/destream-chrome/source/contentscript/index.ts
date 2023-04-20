// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';
    // #endregion external


    // #region internal
    import runViewer from './viewer';
    import runStreamer from './streamer';
    import runView from './view';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        const viewerCleanup = await runViewer();
        const streamerCleanup = await runStreamer();
        const viewCleanup = await runView();

        // const chromeRuntimePort = chrome.runtime.connect();
        // chromeRuntimePort.onDisconnect.addListener(() => {
        //     viewerCleanup();
        //     streamerCleanup();
        //     viewCleanup();
        // });
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
