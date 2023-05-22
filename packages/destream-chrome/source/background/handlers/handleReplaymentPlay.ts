// #region imports
    // #region external
    import {
        Handler,
        Replayment,
        ReplaymentPlayMessage,
        storagePrefix,
        GENERAL_EVENT,
    } from '../../data';

    import {
        storageGet,
    } from '../../common/storage';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPlay: Handler<ReplaymentPlayMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const replayment = await storageGet<Replayment>(storagePrefix.replayment + request.data);
    if (!replayment) {
        sendResponse({
            status: false,
        });
        return;
    }

    await chrome.tabs.sendMessage(request.data, {
        type: GENERAL_EVENT.REPLAY_SESSION_PLAY,
    });

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentPlay;
// #endregion exports
