// #region imports
    // #region external
    import {
        Handler,
        ReplaymentInitializeMessage,

        MESSAGE_TYPE,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';

    import {
        initializeReplayment,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentInitialize: Handler<ReplaymentInitializeMessage> = async (
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
        await sendMessageToTab(sender.tab.id, {
            type: MESSAGE_TYPE.LINKAGE_STARTING,
            data: request.linkageID,
        });

        await sendMessageToTab(sender.tab.id, {
            type: MESSAGE_TYPE.LINKAGE_STARTED,
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
