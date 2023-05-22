// #region imports
    // #region external
    import {
        Handler,
        ReplaymentIndexMessage,
        GENERAL_EVENT,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentStop: Handler<ReplaymentIndexMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    await chrome.tabs.sendMessage(request.data.tabID, {
        type: GENERAL_EVENT.REPLAY_SESSION_INDEX,
        data: request.data.index,
    });

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentStop;
// #endregion exports
