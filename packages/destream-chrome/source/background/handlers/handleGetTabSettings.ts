// #region imports
    // #region external
    import {
        Handler,
        GetTabSettingsMessage
    } from '../../data';

    import {
        getTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleGetTabSettings: Handler<GetTabSettingsMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab.id;
    const tabSettings = await getTabSettings(tabID);

    sendResponse({
        status: !!tabSettings,
        tabSettings,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetTabSettings;
// #endregion exports
