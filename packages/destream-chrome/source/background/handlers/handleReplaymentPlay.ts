// #region imports
    // #region external
    import {
        Handler,
        ReplaymentPlayMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        updateReplayment,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPlay: Handler<ReplaymentPlayMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const updated = await updateReplayment(
        request.data,
        {
            status: 'playing',
        },
    );
    if (!updated) {
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
