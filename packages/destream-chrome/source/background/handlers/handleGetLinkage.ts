// #region imports
    // #region external
    import {
        Handler,
        GetLinkageMessage,
    } from '../../data';

    import {
        getLinkageByTabID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
const handleGetLinkage: Handler<GetLinkageMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab.id;
    console.log('handleGetLinkage', { tabID });
    const linkage = await getLinkageByTabID(tabID);
    console.log('handleGetLinkage', { linkage });

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
