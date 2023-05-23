// #region imports
    // #region external
    import {
        Handler,
        ReplaymentPlayMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        updateReplayment,
        replaymentAtEnd,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPlay: Handler<ReplaymentPlayMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const replayment = await updateReplayment(
        request.data,
        {
            status: 'playing',
        },
    );
    if (!replayment) {
        sendResponse({
            status: false,
        });
        return;
    }

    let reset = false;
    if (replaymentAtEnd(replayment)) {
        await updateReplayment(
            request.data,
            {
                currentIndex: 0,
            },
        );

        await chrome.tabs.sendMessage(request.data, {
            type: GENERAL_EVENT.REPLAY_SESSION_INDEX,
            data: 0,
        });

        reset = true;
    }

    await chrome.tabs.sendMessage(request.data, {
        type: GENERAL_EVENT.REPLAY_SESSION_PLAY,
        reset,
    });

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentPlay;
// #endregion exports
