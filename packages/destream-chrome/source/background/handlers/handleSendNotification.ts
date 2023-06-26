// #region imports
    // #region external
    import {
        Handler,
        MessageSendNotification,
        ResponseMessage,

        NOTIFICATION_KIND,
    } from '~data/index';

    import {
        sendNotificationURLChange,
        sendNotificationSessionStart,
    } from '../notifications';

    import {
        getSession,
    } from '../sessions';
    // #endregion external
// #endregion imports



// #region module
const handleSendNotification: Handler<MessageSendNotification, ResponseMessage> = async (
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

    const session = await getSession(sender.tab.id);
    if (!session) {
        sendResponse({
            status: false,
        });
        return;
    }

    switch (request.data.kind) {
        case NOTIFICATION_KIND.URL_CHANGE:
            sendNotificationURLChange(
                session.streamer,
                sender.tab.id,
                request.data.url,
            );
            break;
        case NOTIFICATION_KIND.SESSION_START:
            sendNotificationSessionStart(
                session.streamer,
                sender.tab.id,
                request.data.url,
            );
            break;
    }

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleSendNotification;
// #endregion exports
