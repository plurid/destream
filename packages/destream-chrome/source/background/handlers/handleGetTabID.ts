// #region imports
    // #region external
    import {
        Handler,
        MessageGetTabID,
        ResponseGetTabID,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const handleGetTabID: Handler<MessageGetTabID, ResponseGetTabID> = async (
    _request,
    sender,
    sendResponse,
) => {
    if (!sender.tab || !sender.tab.id) {
        sendResponse({
            status: false,
        });

        return;
    }

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
