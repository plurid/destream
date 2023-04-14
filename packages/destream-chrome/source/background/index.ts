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

        DEFAULT_API_ENDPOINT,
    } from '../data';

    import {
        storageGetIsStreamer,
        storageGetIdentonym,
        storageGetTokens,
    } from '../common/logic';
    // #endregion external


    // #region internal
    import {
        sendNotificationURLChange,
        sendNotificationSessionStart,
    } from './notifications';

    import {
        publishEvent,
    } from './event';

    import {
        getSession,
        startSession,
        deleteSession,
    } from './session';

    import messagerManager from './messager';
    import subscriptionManager from './subscriptions';

    import {
        generateClient,
        START_SESSION,
        STOP_SESSION,
    } from './graphql';
    // #endregion internal
// #endregion imports



// #region module
const graphqlClient = generateClient();


export type Handler<R> = (
    request: R,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<boolean>;

const handlePublishEvent: Handler<PublishEventMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    publishEvent(request.data);

    sendResponse({
        status: true,
    });

    return true;
}

const handleGetTabID: Handler<GetTabIDMessage> = async (
    _request,
    sender,
    sendResponse,
) => {
    sendResponse({
        status: true,
        tabID: sender.tab.id,
    });

    return true;
}

const handleGetSession: Handler<GetSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const session = await getSession(request.data);

    sendResponse({
        status: !!session,
        session,
    });

    return true;
}

const handleStartSession: Handler<StartSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const isStreamer = await storageGetIsStreamer();
    const identonym = await storageGetIdentonym();
    if (!isStreamer || !identonym) {
        sendResponse({
            status: false,
        });
        return;
    }

    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const graphqlRequest = await graphqlClient.mutate({
        mutation: START_SESSION,
        variables: {
            input: {
                value: request.data.url,
            },
        },
    });
    const response = graphqlRequest.data.destreamStartSession;

    if (response.status) {
        const sessionID = response.data.id;
        await startSession(request.data.tabID, sessionID);

        // save token for publishing
    }

    sendResponse({
        status: response.status,
    });

    return true;
}

const handleStopSession: Handler<StopSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const isStreamer = await storageGetIsStreamer();
    const identonym = await storageGetIdentonym();
    if (!isStreamer || !identonym) {
        sendResponse({
            status: false,
        });
        return;
    }

    const session = await getSession(request.data.tabID);

    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const graphqlRequest = await graphqlClient.mutate({
        mutation: STOP_SESSION,
        variables: {
            input: {
                value: session.id,
            },
        },
    });
    const response = graphqlRequest.data.destreamStopSession;

    if (response.status) {
        await deleteSession(request.data.tabID);
    }

    sendResponse({
        status: response.status,
    });

    return true;
}

const handleStartSubscription: Handler<StartSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    subscriptionManager.new(request.data);

    sendResponse({
        status: true,
    });

    return true;
}

const handleStopSubscription: Handler<StopSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    subscriptionManager.remove(request.data);

    sendResponse({
        status: true,
    });

    return true;
}

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
        return true;
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


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    messageHandler(request, sender, sendResponse);

    // Indicate the response is asynchronous.
    return true;
});
// #endregion module
