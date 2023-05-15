// #region imports
    // #region external
    import {
        Handler,
        StopSessionMessage,
        GENERAL_EVENT,
    } from '../../data';

    import {
        storageGetIsStreamer,
        storageGetIdentonym,
    } from '../../common/storage';

    import {
        getSession,
        deleteSession,
        stopSessionLogic,
    } from '../sessions';

    import {
        getPublishTopicID,
        removeTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleStopSession: Handler<StopSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const {
        tabID,
    } = request.data;

    const emptyResponse = async () => {
        // Try session delete anyway.
        await deleteSession(tabID);
        await removeTabSettings(tabID);

        sendResponse({
            status: false,
        });

        return;
    }

    const isStreamer = await storageGetIsStreamer();
    const identonym = await storageGetIdentonym();
    if (!isStreamer || !identonym) {
        return await emptyResponse();
    }

    const session = await getSession(tabID);
    if (!session) {
        return await emptyResponse();
    }

    const response = await stopSessionLogic(
        session.id,
        tabID,
    );

    await chrome.tabs.sendMessage(session.tabID, {
        type: GENERAL_EVENT.STOP_SESSION,
        topic: getPublishTopicID(session.id),
        session,
    });

    sendResponse({
        status: response.status,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSession;
// #endregion exports
