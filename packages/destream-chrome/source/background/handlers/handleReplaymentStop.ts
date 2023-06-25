// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentStop,
        RequestReplaymentStop,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';

    import {
        stopReplaymentWithTabID,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentStop: Handler<MessageReplaymentStop> = async (
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
