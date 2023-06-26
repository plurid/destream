// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentInitialize,
        ResponseMessage,
        LinkageStartingMessage,
        LinkageStartedMessage,

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
        true,
    );

    if (request.linkageID) {
        await sendMessageToTab<LinkageStartingMessage>(sender.tab.id, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTING,
            data: request.linkageID,
        });

        await sendMessageToTab<LinkageStartedMessage>(sender.tab.id, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTED,
            data: request.linkageID,
        });
    }

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentInitialize;
// #endregion exports
