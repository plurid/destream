// #region imports
    // #region internal
    import {
        runViewer,
    } from './viewer';

    import {
        runStreamer,
    } from './streamer';
    // #endregion internal
// #endregion imports



// #region module
const main = () => {
    runViewer();
    runStreamer();
}

main();
// #endregion module
