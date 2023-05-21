// #region imports
    // #region external
    import {
        Handler,
        ReplaySessionMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        openTab,
    } from '../utilities';
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

    const tab = await openTab(url);

    setTimeout(async () => {
        await chrome.tabs.sendMessage(tab.id, {
            type: GENERAL_EVENT.REPLAY_SESSION,
            data,
        });
    }, 2_000);

    // save replay session data
    const replaySession = {
        tabID: tab.id,
        data,
    };

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaySession;
// #endregion exports
