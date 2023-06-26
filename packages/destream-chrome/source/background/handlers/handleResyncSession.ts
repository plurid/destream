// #region imports
    // #region external
    import {
        Handler,
        MessageResyncSession,
        RequestResyncSession,
        ResponseMessage,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';
    // #endregion external
// #endregion imports



// #region module
const handleResyncSession: Handler<MessageResyncSession, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const tabID = request.data;

    await sendMessageToTab<RequestResyncSession>(tabID, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.RESYNC_SESSION,
    });

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleResyncSession;
// #endregion exports
