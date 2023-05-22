// #region imports
    // #region external
    import {
        Handler,
        ReplaySessionMessage,
        Replayment,
        GENERAL_EVENT,
        storagePrefix,
    } from '../../data';

    import {
        openTab,
    } from '../utilities';

    import {
        storageSet,
    } from '../../common/storage';
    // #endregion external
// #endregion imports



// #region module
const handleReplaySession: Handler<ReplaySessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const {
        data,
    } = request;

    const {
        url,
    } = data;

    const tab = await openTab(url, true);

    setTimeout(async () => {
        await chrome.tabs.sendMessage(tab.id, {
            type: GENERAL_EVENT.REPLAY_SESSION,
            data,
        });
    }, 2_000);

    const replayment: Replayment = {
        tabID: tab.id,
        data,
        currentIndex: 0,
        status: 'playing',
    };
    await storageSet(storagePrefix.replayment + tab.id, replayment);

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaySession;
// #endregion exports
