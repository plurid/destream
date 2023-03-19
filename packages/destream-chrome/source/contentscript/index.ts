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
const main = () => {
    runViewer();
    runStreamer();
    // injectView();
}

main();
// #endregion module
