// #region imports
    // #region external
    import {
        Handler,
        MessageGetLinkage,
        ResponseGetLinkage,
    } from '../../data';

    import {
        getLinkageByTabID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
const handleGetLinkage: Handler<MessageGetLinkage> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab.id;
    const linkage = await getLinkageByTabID(tabID);

    const response: ResponseGetLinkage = {
        status: !!linkage,
        linkage,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleGetLinkage;
// #endregion exports
