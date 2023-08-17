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
    const tabID = request.data || sender.tab?.id;
    if (!tabID) {
        sendResponse({
            status: false,
        });
        return;
    }

    const linkage = await getLinkageByTabID(tabID);
    if (!linkage) {
        sendResponse({
            status: false,
        });
        return;
    }

    sendResponse({
        status: true,
        linkage,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetLinkage;
// #endregion exports
