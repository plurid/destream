// #region imports
    // #region external
    import {
        Handler,
        ResyncSessionMessage,
        GENERAL_EVENT,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleResyncSession: Handler<ResyncSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const tabID = request.data;

    // request current state from the tab
    // await chrome.tabs.sendMessage(tabID, {
    //     type: GENERAL_EVENT.CURRENT_STATE,
    // });

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleResyncSession;
// #endregion exports
