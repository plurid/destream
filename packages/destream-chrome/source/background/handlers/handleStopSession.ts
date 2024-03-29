// #region imports
    // #region external
    import {
        Handler,
        MessageStopSession,
        RequestStopSession,
        ResponseMessage,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        storageGetIsStreamer,
        storageGetIdentonym,
    } from '~common/storage';

    import {
        log,
    } from '~common/utilities';

    import {
        getSession,
        deleteSession,
        stopSessionLogic,
    } from '../sessions';

    import {
        removeTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleStopSession: Handler<MessageStopSession, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    try {
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

        await sendMessageToTab<RequestStopSession>(session.tabID, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SESSION,
            session,
        });

        sendResponse({
            status: response.status,
        });

        return;
    } catch (error) {
        log(error);

        sendResponse({
            status: false,
        });

        return;
    }
}
// #endregion module



// #region exports
export default handleStopSession;
// #endregion exports
