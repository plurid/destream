// #region imports
    // #region external
    import {
        Handler,
        StartSubscriptionMessage,
        GeneralPermissions,
        DEFAULT_API_ENDPOINT,
        storageFields,
    } from '../../data';

    import {
        storageGetTokens,
        storageGet,
    } from '../../common/storage';

    import {
        generateClient,
        GET_ACTIVE_SESSIONS,
    } from '../graphql';

    import {
        startSessionSubscriptionLogic,
    } from '../subscriptions';
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

    const generalPermissions: GeneralPermissions = await storageGet(storageFields.generalPermissions);

    const {
        sessions,
        streamerDetails,
    } = activeSessionsResponse.data;

    for (const session of sessions) {
        await startSessionSubscriptionLogic(
            graphqlClient,
            session.id,
            session.url,
            session.customPubSubLink,
            streamerIdentonym,
            generalPermissions,
            streamerDetails,
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
