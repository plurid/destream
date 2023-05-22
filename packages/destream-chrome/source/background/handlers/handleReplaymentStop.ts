// #region imports
    // #region external
    import {
        Handler,
        ReplaymentStopMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        stopReplaymentWithTabID,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentStop: Handler<ReplaymentStopMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    await chrome.tabs.sendMessage(request.data, {
        type: GENERAL_EVENT.REPLAY_SESSION_STOP,
    });

    await stopReplaymentWithTabID(request.data);

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentStop;
// #endregion exports
