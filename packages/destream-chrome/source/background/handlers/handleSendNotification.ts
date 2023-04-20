// #region imports
    // #region external
    import {
        Handler,
        NOTIFICATION_KIND,
        SendNotificationMessage,
    } from '../../data';

    import {
        sendNotificationURLChange,
        sendNotificationSessionStart,
    } from '../notifications';

    import {
        getSession,
    } from '../session';
    // #endregion external
// #endregion imports



// #region module
const handleSendNotification: Handler<SendNotificationMessage> = async (
    request,
    sender,
    sendResponse,
) => {
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
