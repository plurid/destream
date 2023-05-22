// #region imports
    // #region external
    import {
        Handler,
        ReplaymentPauseMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        updateReplayment,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPause: Handler<ReplaymentPauseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const updated = await updateReplayment(
        request.data,
        {
            status: 'paused',
        },
    );
    if (!updated) {
        sendResponse({
            status: false,
        });
        return;
    }

    await chrome.tabs.sendMessage(request.data, {
        type: GENERAL_EVENT.REPLAY_SESSION_PAUSE,
    });

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentPause;
// #endregion exports
