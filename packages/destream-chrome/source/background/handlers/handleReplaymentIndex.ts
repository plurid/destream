// #region imports
    // #region external
    import {
        Handler,
        ReplaymentIndexMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        updateReplayment,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentStop: Handler<ReplaymentIndexMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const updated = await updateReplayment(
        request.data.tabID,
        {
            currentIndex: request.data.index,
        },
    );
    if (!updated) {
        sendResponse({
            status: false,
        });
        return;
    }

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
