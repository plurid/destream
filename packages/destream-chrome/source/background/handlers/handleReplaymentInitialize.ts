// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentInitialize,
        ResponseMessage,
        MessageLinkageStarting,
        MessageLinkageStarted,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        initializeReplayment,
    } from '../replayments';
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
        () => {},
        request.linkageID,
    );

    if (request.linkageID) {
        await sendMessageToTab<MessageLinkageStarting>(sender.tab.id, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTING,
            data: request.linkageID,
        });

        setTimeout(async () => {
            await sendMessageToTab<MessageLinkageStarted>(sender.tab.id, {
                type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTED,
                data: request.linkageID,
            });
        }, 2_000);
    }

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentInitialize;
// #endregion exports
