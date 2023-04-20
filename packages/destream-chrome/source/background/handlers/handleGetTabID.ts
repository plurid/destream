// #region imports
    // #region external
    import {
        Handler,
        GetTabIDMessage,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleGetTabID: Handler<GetTabIDMessage> = async (
    _request,
    sender,
    sendResponse,
) => {
    sendResponse({
        status: true,
        tabID: sender.tab.id,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetTabID;
// #endregion exports
