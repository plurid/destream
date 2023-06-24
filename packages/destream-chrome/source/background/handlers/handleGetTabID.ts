// #region imports
    // #region external
    import {
        Handler,
        MessageGetTabID,
        ResponseGetTabID,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleGetTabID: Handler<MessageGetTabID> = async (
    _request,
    sender,
    sendResponse,
) => {
    if (!sender.tab || !sender.tab.id) {
        const response: ResponseGetTabID = {
            status: false,
        };
        sendResponse(response);

        return;
    }

    const response: ResponseGetTabID = {
        status: true,
        tabID: sender.tab.id,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleGetTabID;
// #endregion exports
