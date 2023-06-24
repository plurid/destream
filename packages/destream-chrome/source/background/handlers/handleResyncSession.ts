// #region imports
    // #region external
    import {
        Handler,
        ResyncSessionMessage,
        GENERAL_EVENT,
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
        type: GENERAL_EVENT.RESYNC_SESSION,
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
