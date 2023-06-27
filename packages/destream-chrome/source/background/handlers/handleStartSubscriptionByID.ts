// #region imports
    // #region external
    import {
        Handler,
        MessageStartSubscriptionByID,
        ResponseMessage,
    } from '~data/index';

    import {
        log,
    } from '~common/utilities';

    import {
        GET_ACTIVE_SESSION,
    } from '../graphql';

    import {
        startSessionSubscriptionLogic,
    } from '../subscriptions';

    import {
        getDefaultGraphqlClient,
        getGeneralPermissions,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleStartSubscriptionByID: Handler<MessageStartSubscriptionByID, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    try {
        const graphqlClient = await getDefaultGraphqlClient();

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

        const generalPermissions = await getGeneralPermissions();

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
