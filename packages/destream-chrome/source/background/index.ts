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
const handlePublishEvent = async (
    request: PublishEventMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    publishEvent(request.data);

    return true;
}

const handleGetTabID = (
    _request: GetTabIDMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    sendResponse({
        tabID: sender.tab.id,
    });

    return true;
}

const handleGetSession = async (
    _request: GetSessionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    try {
        const session = await getSession(sender.tab.id);

        sendResponse({
            session,
        });
    } catch (error) {
    }

    return true;
}

const handleSendNotification = async (
    request: SendNotificationMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
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

const messageHandler = async (
    request: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
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
