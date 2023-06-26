// #region imports
    // #region external
    import {
        Handler,
        MessageGetLinkage,
        ResponseGetLinkage,
    } from '~data/interfaces';

    import {
        getLinkageByTabID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
const handleGetLinkage: Handler<MessageGetLinkage, ResponseGetLinkage> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab.id;
    const linkage = await getLinkageByTabID(tabID);

    sendResponse({
        status: !!linkage,
        linkage,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetLinkage;
// #endregion exports
