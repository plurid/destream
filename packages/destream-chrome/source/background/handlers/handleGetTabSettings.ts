// #region imports
    // #region external
    import {
        Handler,
        MessageGetTabSettings,
        ResponseGetTabSettings,
    } from '~data/interfaces';

    import {
        getTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleGetTabSettings: Handler<MessageGetTabSettings, ResponseGetTabSettings> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab?.id;
    if (!tabID) {
        sendResponse({
            status: false,
        });
        return;
    }

    const tabSettings = await getTabSettings(tabID);
    if (!tabSettings) {
        sendResponse({
            status: false,
        });
        return;
    }

    sendResponse({
        status: true,
        tabSettings,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetTabSettings;
// #endregion exports
