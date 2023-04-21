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
    } from '../graphql';

    import {
        startSubscription,
    } from '../subscriptions';

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

    for (const session of activeSessionsResponse.data) {
        // record viewer

        const tab = await openTab(session.url);

        await startSubscription(
            streamerIdentonym,
            session.id,
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
