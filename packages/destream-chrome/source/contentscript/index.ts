// #region imports
    // #region external
    import {
        log,
    } from '~common/utilities';
    // #endregion external


    // #region internal
    import MessagerClient from './client';
    import runChecker from './checker';
    import runStreamer from './streamer';
    import runViewer from './viewer';
    import runView from './view';
    import runReplayer from './replayer';
    import runLinkage from './linkage';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        await runChecker();

        const client = new MessagerClient();

        await runStreamer(client);
        await runViewer(client);
        await runView();
        await runReplayer(client);
        await runLinkage();
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
