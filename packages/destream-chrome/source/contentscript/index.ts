// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';
    // #endregion external


    // #region internal
    import MessagerClient from './client';
    import runViewer from './viewer';
    import runStreamer from './streamer';
    import runView from './view';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        const client = new MessagerClient();

        const viewerCleanup = await runViewer(client);
        const streamerCleanup = await runStreamer(client);
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
