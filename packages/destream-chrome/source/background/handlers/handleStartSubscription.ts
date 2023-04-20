// #region imports
    // #region external
    import {
        Handler,
        StartSubscriptionMessage,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetTokens,
    } from '../../common/logic';

    import subscriptionManager from '../subscriptions';

    import {
        generateClient,
        GET_ACTIVE_SESSIONS,
    } from '../graphql';

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
// #endregion module



// #region exports
export default handleStartSubscription;
// #endregion exports
