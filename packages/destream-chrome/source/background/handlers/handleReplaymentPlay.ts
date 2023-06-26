// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentPlay,
        RequestReplaymentPlay,
        RequestReplaymentIndex,
        ResponseMessage,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        updateReplayment,
        replaymentAtEnd,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPlay: Handler<MessageReplaymentPlay, ResponseMessage> = async (
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

        await sendMessageToTab<RequestReplaymentIndex>(request.data, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_INDEX,
            data: 0,
        });

        reset = true;
    }

    await sendMessageToTab<RequestReplaymentPlay>(request.data, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PLAY,
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
