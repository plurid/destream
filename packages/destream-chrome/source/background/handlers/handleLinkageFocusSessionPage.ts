// #region imports
    // #region external
    import {
        Handler,
        MessagerLinkageFocusSessionPage,
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
const handleLinkageFocusSessionPage: Handler<MessagerLinkageFocusSessionPage, ResponseMessage> = async (
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

    const sessionTabID = linkage.sessionTabs[request.sessionID];

    await tabsUpdate(
        sessionTabID,
        {
            active: true,
        },
    ).catch(() => {
        // Ignore if no tab or other error.
    });

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleLinkageFocusSessionPage;
// #endregion exports
