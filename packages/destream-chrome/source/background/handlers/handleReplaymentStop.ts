// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentStop,
        RequestReplaymentStop,
        ResponseMessage,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        stopReplaymentWithTabID,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentStop: Handler<MessageReplaymentStop, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    await sendMessageToTab<RequestReplaymentStop>(request.data, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_STOP,
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
