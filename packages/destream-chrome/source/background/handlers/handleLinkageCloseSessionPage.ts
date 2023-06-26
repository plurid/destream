// #region imports
    // #region external
    import {
        Handler,
        MessagerLinkageCloseSessionPage,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        getLinkageByTabID,
    } from '../linkages';

    import {
        tabsClose,
    } from '~common/tab';
    // #endregion external
// #endregion imports



// #region module
const handleLinkageCloseSessionPage: Handler<MessagerLinkageCloseSessionPage, ResponseMessage> = async (
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

    const sessionTabID = 0;

    await tabsClose(
        sessionTabID,
    );

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleLinkageCloseSessionPage;
// #endregion exports
