// #region imports
    // #region external
    import {
        Handler,
        MessagerLinkageSetMediaTime,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/constants';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        getLinkageByTabID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
const handleLinkageSetMediaTime: Handler<MessagerLinkageSetMediaTime, ResponseMessage> = async (
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

    await sendMessageToTab(sessionTabID, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SET_MEDIA_TIME,
        data: request.data,
    });

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleLinkageSetMediaTime;
// #endregion exports
