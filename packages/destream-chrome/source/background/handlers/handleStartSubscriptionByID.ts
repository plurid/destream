// #region imports
    // #region external
    import {
        Handler,
        StartSubscriptionByIDMessage,
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
        GET_ACTIVE_SESSION,
    } from '../graphql';

    import {
        startSessionSubscriptionLogic,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleStartSubscriptionByID: Handler<StartSubscriptionByIDMessage> = async (
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

    const sessionID = request.data;

    const activeSessionsRequest = await graphqlClient.query({
        query: GET_ACTIVE_SESSION,
        variables: {
            input: {
                value: sessionID,
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

    const session = sessions.filter((session: any) => session.id === sessionID);

    const startedSubscription = await startSessionSubscriptionLogic(
        graphqlClient,
        sessionID,
        session.url,
        session.customPubSubLink,
        streamerDetails.name,
        generalPermissions,
        streamerDetails,
    );

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStartSubscriptionByID;
// #endregion exports
