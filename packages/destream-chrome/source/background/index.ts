// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        NOTIFICATION_KIND,
        Message,
        PublishEventMessage,
        GetTabIDMessage,
        GetSessionMessage,
        StartSessionMessage,
        StopSessionMessage,
        StartSubscriptionMessage,
        StopSubscriptionMessage,
        SendNotificationMessage,
    } from '../data';

    import {
        storageGetIsStreamer,
    } from '../common/logic';
    // #endregion external


    // #region internal
    import {
        sendNotificationURLChange,
    } from './notifications';

    import {
        publishEvent,
    } from './event';

    import {
        handleConnectExternal,
    } from './persistent';

    import {
        getSession,
        startSession,
        deleteSession,
    } from './session';

    import subscriptionManager from './subscriptions';
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

const handleStartSession: Handler<StartSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const isStreamer = await storageGetIsStreamer();
    if (!isStreamer) {
        return;
    }

    await startSession(sender.tab.id);

    return true;
}

const handleStopSession: Handler<StopSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    await deleteSession(sender.tab.id);

    return true;
}

const handleStartSubscription: Handler<StartSubscriptionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    subscriptionManager.new(request.data);

    return true;
}

const handleStopSubscription: Handler<StopSubscriptionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    subscriptionManager.remove(request.data);

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
        case MESSAGE_TYPE.START_SESSION:
            return handleStartSession(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SESSION:
            return handleStopSession(request, sender, sendResponse);
        case MESSAGE_TYPE.START_SUBSCRIPTION:
            return handleStartSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SUBSCRIPTION:
            return handleStopSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.SEND_NOTIFICATION:
            return handleSendNotification(request, sender, sendResponse);
        default:
            return true;
    }
}

chrome.runtime.onMessage.addListener(messageHandler);


// Make service worker persistent.
chrome.runtime.onConnectExternal.addListener(handleConnectExternal);
// #endregion module
