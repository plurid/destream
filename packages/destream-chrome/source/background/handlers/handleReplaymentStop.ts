// #region imports
    // #region external
    import {
        Handler,
        ReplaymentStopMessage,
        storagePrefix,
        GENERAL_EVENT,
    } from '../../data';

    import {
        storageRemove,
    } from '../../common/storage';
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

    await storageRemove(storagePrefix.replayment + request.data);

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentStop;
// #endregion exports
