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
        GetSubscriptionMessage,
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
        sessionOrderIndex,
    } from './session';

    import {
        getSubscription,
        getSubscriptionByTabID,
        startSubscription,
        deleteSubscription,
    } from './subscriptions';

    import subscriptionManager from './subscriptions';

    import {
        generateClient,
        START_SESSION,
        STOP_SESSION,
        RECORD_SESSION_EVENT,
        GET_ACTIVE_SESSIONS,
        GET_SESSION,
    } from './graphql';

    import {
        openTab,
    } from './utilities';
    // #endregion internal
// #endregion imports



// #region module
export type Handler<R> = (
    request: R,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<void>;


const handlePublishEvent: Handler<PublishEventMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const session = await getSession(sender.tab.id);
    if (!session) {
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

    const orderIndex = sessionOrderIndex.get(session.id);
    const relativeTime = Date.now() - session.startedAt;
    const data = JSON.stringify(request.data);

    const graphqlRequest = await graphqlClient.mutate({
        mutation: RECORD_SESSION_EVENT,
        variables: {
            input: {
                id: session.id,
                orderIndex,
                relativeTime,
                data,
            },
        },
    });
    const response = graphqlRequest.data.destreamRecordSessionEvent;
    if (!response.status) {
        sendResponse({
            status: false,
        });
        return;
    }

    const published = publishEvent(session, request.data);
    sendResponse({
        status: published,
    });

    return;
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

    return;
}

const handleGetSession: Handler<GetSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const session = await getSession(request.data || sender.tab.id);

    sendResponse({
        status: !!session,
        session,
    });

    return;
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
        const {
            id,
            token,
        } = response.data;

        await startSession(
            request.data.tabID,
            id,
            identonym,
            token,
        );
    }

    sendResponse({
        status: response.status,
    });

    return;
}

const handleStopSession: Handler<StopSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const isStreamer = await storageGetIsStreamer();
    const identonym = await storageGetIdentonym();
    if (!isStreamer || !identonym) {
        // Try session delete anyway.
        await deleteSession(request.data.tabID);

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

    return;
}

const handleStartSubscription: Handler<StartSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const activeSessionsRequest = await graphqlClient.query({
        query: GET_ACTIVE_SESSIONS,
        variables: {
            input: {
                value: request.data, // identonym
            },
        },
    });
    const activeSessionsResponse = activeSessionsRequest.data.destreamGetActiveSessions;
    if (!activeSessionsResponse.status) {
        sendResponse({
            status: false,
        });
        return;
    }

    for (const session of activeSessionsResponse.data) {
        // record viewer

        // open tab with session.url
        const tab = await openTab(session.url);

        subscriptionManager.new(request.data);

        // record subscription
        // startSubscription(
        // );
    }


    sendResponse({
        status: true,
    });

    return;
}

const handleStopSubscription: Handler<StopSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    subscriptionManager.remove(request.data);

    // remove subscription
    // await deleteSession(request.data.tabID);

    sendResponse({
        status: true,
    });

    return;
}

const handleGetSubscription: Handler<GetSubscriptionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab.id;
    const subscription = await getSubscriptionByTabID(tabID);

    sendResponse({
        status: true,
        subscription,
    });

    return;
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
        case MESSAGE_TYPE.GET_SUBSCRIPTION:
            return handleGetSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.SEND_NOTIFICATION:
            return handleSendNotification(request, sender, sendResponse);
        default:
            return;
    }
}


const main = () => {
    try {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            messageHandler(request, sender, sendResponse);

            // Indicate the response is asynchronous.
            return true;
        });
    } catch (error) {
        console.log(error);
    }
}

main();
// #endregion module
