// #region imports
    // #region external
    import {
        Handler,
        ResyncSessionMessage,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';
    // #endregion external
// #endregion imports



// #region module
const handleResyncSession: Handler<ResyncSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const tabID = request.data;

    await sendMessageToTab(tabID, {
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
