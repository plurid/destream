// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
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
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    const data = JSON.parse(request.event);
    publishEvent(data.event);

    return true;
}

const handleGetTabID = (
    _request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    sendResponse({
        tabID: sender.tab.id,
    });

    return true;
}

const handleGetSession = async (
    request: any,
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
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    switch (request.kind) {
        case 'urlChange':
            sendNotificationURLChange(request.url);
            break;
    }

    return true;
}

const messageHandler = (
    request: any,
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
    }

    return true;
}

chrome.runtime.onMessage.addListener(messageHandler);
// #endregion module
