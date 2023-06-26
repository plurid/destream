// #region imports
    // #region external
    import {
        Handler,
        MessagerLinkageFocusInitialPage,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        getLinkageByTabID,
    } from '../linkages';

    import {
        tabsUpdate,
    } from '~common/tab';
    // #endregion external
// #endregion imports



// #region module
const handleLinkageFocusInitialPage: Handler<MessagerLinkageFocusInitialPage, ResponseMessage> = async (
    request,
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

    await tabsUpdate(
        linkage.tabID,
        {
            active: true,
        },
    );

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleLinkageFocusInitialPage;
// #endregion exports
