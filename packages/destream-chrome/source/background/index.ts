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
    } from './event';
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
    const tabID = sender.tab.id;
    const id = `tab-settings-${tabID}`;

    try {
        const result = await chrome.storage.local.get([id]);
        sendResponse({
            session: result[id],
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
            sendNotificationURLChange(request.data.url);
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
// #endregion module
