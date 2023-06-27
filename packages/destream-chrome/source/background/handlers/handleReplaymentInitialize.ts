// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentInitialize,
        ResponseMessage,
        MessageLinkageSessionStarting,
        MessageLinkageSessionStarted,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        initializeReplayment,
    } from '../replayments';

    import {
        noOp,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentInitialize: Handler<MessageReplaymentInitialize, ResponseMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const sessionID = request.data;

    await initializeReplayment(
        sessionID,
        noOp,
        request.linkageID,
    );

    if (request.linkageID) {
        await sendMessageToTab<MessageLinkageSessionStarting>(sender.tab.id, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_STARTING,
            data: request.linkageID,
        });

        setTimeout(async () => {
            await sendMessageToTab<MessageLinkageSessionStarted>(sender.tab.id, {
                type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_STARTED,
                data: request.linkageID,
            });
        }, 500);
    }

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentInitialize;
// #endregion exports
