// #region imports
    // #region external
    import {
        Handler,
        MessagerLinkageSessionEnded,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        storageRemove,
        storageUpdate,
    } from '~common/storage';

    import {
        getLinkageStorageID,
        getLinkageByTabID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
const handleLinkageSessionEnded: Handler<MessagerLinkageSessionEnded, ResponseMessage> = async (
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

    const linkage = await getLinkageByTabID(sender.tab.id);
    if (!linkage) {
        sendResponse({
            status: false,
        });
        return;
    }

    const linkageStorageID = getLinkageStorageID(linkage.tabID);
    const endedSessions = linkage.endedSessions + 1;

    if (linkage.sessions.length === endedSessions) {
        setTimeout(async () => {
            await storageRemove(linkageStorageID);
        }, 1_000);
    } else {
        storageUpdate(
            linkageStorageID,
            {
                endedSessions,
            },
        );
    }

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleLinkageSessionEnded;
// #endregion exports
