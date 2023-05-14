// #region imports
    // #region external
    import {
        Handler,
        StartSubscriptionMessage,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetTokens,
    } from '../../common/storage';

    import {
        generateClient,
        GET_ACTIVE_SESSIONS,
        START_SESSION_SUBSCRIPTION,
    } from '../graphql';

    import {
        startSubscription,
    } from '../subscriptions';

    import {
        sendNotificationSessionStart,
    } from '../notifications';

    import {
        openTab,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
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

    const streamerIdentonym = request.data;

    const activeSessionsRequest = await graphqlClient.query({
        query: GET_ACTIVE_SESSIONS,
        variables: {
            input: {
                value: streamerIdentonym,
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

    const {
        sessions,
        streamerDetails,
    } = activeSessionsResponse.data;

    for (const session of sessions) {
        const sessionSubscription = await graphqlClient.mutate({
            mutation: START_SESSION_SUBSCRIPTION,
            variables: {
                input: {
                    value: session.id,
                },
            },
        });
        const sessionSubscriptionResponse = sessionSubscription.data.destreamStartSessionSubscription;
        if (!sessionSubscriptionResponse.status) {
            continue;
        }

        const tab = await openTab(session.url);

        const pubsubEndpoint = session.customPubSubLink || DEFAULT_API_ENDPOINT;

        sendNotificationSessionStart(
            streamerIdentonym,
            tab.id,
            session.url,
        );

        await startSubscription(
            streamerIdentonym,
            streamerDetails,
            session.id,
            sessionSubscriptionResponse.data,
            pubsubEndpoint,
            tab.id,
        );
    }

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStartSubscription;
// #endregion exports
