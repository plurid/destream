// #region imports
    // #region external
    import {
        Handler,
        ReplaymentIndexMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';

    import {
        updateReplayment,
        replaymentAtEnd,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentIndex: Handler<ReplaymentIndexMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const replayment = await updateReplayment(
        request.data.tabID,
        {
            currentIndex: request.data.index,
        },
    );
    if (!replayment) {
        sendResponse({
            status: false,
        });
        return;
    }

    if (request.data.updateTab) {
        await sendMessageToTab(request.data.tabID, {
            type: GENERAL_EVENT.REPLAY_SESSION_INDEX,
            data: request.data.index,
        });
    }

    if (replaymentAtEnd(replayment, request.data.index)) {
        await updateReplayment(
            request.data.tabID,
            {
                status: 'paused',
            },
        );

        await sendMessageToTab(request.data.tabID, {
            type: GENERAL_EVENT.REPLAY_SESSION_PAUSE,
        });
    }

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentIndex;
// #endregion exports
