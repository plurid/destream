// #region imports
    // #region external
    import {
        Handler,
        MessageResyncSession,
        RequestResyncSession,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';
    // #endregion external
// #endregion imports



// #region module
const handleResyncSession: Handler<MessageResyncSession> = async (
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
