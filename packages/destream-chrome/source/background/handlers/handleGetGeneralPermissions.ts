// #region imports
    // #region external
    import {
        Handler,
        MessageGetGeneralPermissions,
        ResponseGetGeneralPermissions,
    } from '~data/interfaces';

    import {
        getGeneralPermissions,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleGetGeneralPermissions: Handler<MessageGetGeneralPermissions, ResponseGetGeneralPermissions> = async (
    _request,
    _sender,
    sendResponse,
) => {
    const generalPermissions = await getGeneralPermissions();

    sendResponse({
        status: true,
        generalPermissions,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetGeneralPermissions;
// #endregion exports
