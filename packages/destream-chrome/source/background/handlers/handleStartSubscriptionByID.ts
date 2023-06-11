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
        log,
    } from '../../common/utilities';

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
    try {
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
        const activeSessionsResponse = activeSessionsRequest.data.destreamGetActiveSession;
        if (!activeSessionsResponse.status) {
            sendResponse({
                status: false,
            });
            return;
        }

        const generalPermissions: GeneralPermissions = await storageGet(storageFields.generalPermissions);

        const {
            session,
            streamerDetails,
        } = activeSessionsResponse.data;

        if (!session) {
            sendResponse({
                status: false,
            });
            return;
        }

        const startedSubscription = await startSessionSubscriptionLogic(
            graphqlClient,
            sessionID,
            session.url,
            session.customPubSubLink,
            session.incognito,
            streamerDetails.streamerName,
            generalPermissions,
            streamerDetails,
        );

        sendResponse({
            status: startedSubscription,
        });

        return;
    } catch (error) {
        log(error);

        sendResponse({
            status: false,
        });

        return;
    }
}
// #endregion module



// #region exports
export default handleStartSubscriptionByID;
// #endregion exports
