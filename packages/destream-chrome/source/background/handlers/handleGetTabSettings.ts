// #region imports
    // #region external
    import {
        Handler,
        MessageGetTabSettings,
        ResponseGetTabSettings,
    } from '../../data';

    import {
        getTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleGetTabSettings: Handler<MessageGetTabSettings> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab?.id;
    const tabSettings = await getTabSettings(tabID);

    const response: ResponseGetTabSettings = {
        status: !!tabSettings,
        tabSettings,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleGetTabSettings;
// #endregion exports
