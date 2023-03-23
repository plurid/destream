// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        NOTIFICATION_KIND,
        Message,
        PublishEventMessage,
        GetTabIDMessage,
        GetSessionMessage,
        SendNotificationMessage,
    } from '../data';
    // #endregion external


    // #region internal
    import {
        sendNotificationURLChange,
    } from './notifications';

    import {
        publishEvent,
        run,
    } from './event';

    import {
        handleConnectExternal,
    } from './persistent';

    import {
        getSession,
    } from './session';
    // #endregion internal
// #endregion imports



// #region module
export type Handler<R> = (
    request: R,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<boolean>;

const handlePublishEvent: Handler<PublishEventMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    publishEvent(request.data);

    return true;
}

const handleGetTabID: Handler<GetTabIDMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    sendResponse({
        tabID: sender.tab.id,
    });

    return true;
}

const handleGetSession: Handler<GetSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const session = await getSession(sender.tab.id);

    sendResponse({
        session,
    });

    return true;
}

const handleSendNotification: Handler<SendNotificationMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    switch (request.data.kind) {
        case NOTIFICATION_KIND.URL_CHANGE:
            // get session based on tab id
            // get streamer name from session
            const streamerName = '';

            sendNotificationURLChange(
                streamerName,
                sender.tab.id,
                request.data.url,
            );
            break;
    }

    return true;
}

const messageHandler: Handler<Message> = async (
    request,
    sender,
    sendResponse,
) => {
    switch (request.type) {
        case MESSAGE_TYPE.PUBLISH_EVENT:
            return handlePublishEvent(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_TAB_ID:
            return handleGetTabID(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_SESSION:
            return handleGetSession(request, sender, sendResponse);
        case MESSAGE_TYPE.SEND_NOTIFICATION:
            return handleSendNotification(request, sender, sendResponse);
        default:
            return true;
    }
}

chrome.runtime.onMessage.addListener(messageHandler);

run();


// Make service worker persistent.
chrome.runtime.onConnectExternal.addListener(handleConnectExternal);
// #endregion module
