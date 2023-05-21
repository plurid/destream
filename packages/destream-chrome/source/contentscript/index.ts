// #region imports
    // #region external
    import {
        log,
    } from '../common/utilities';
    // #endregion external


    // #region internal
    import MessagerClient from './client';
    import runStreamer from './streamer';
    import runViewer from './viewer';
    import runView from './view';
    import runReplayer from './replayer';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        const client = new MessagerClient();

        await runStreamer(client);
        await runViewer(client);
        await runView();
        await runReplayer(client);
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
