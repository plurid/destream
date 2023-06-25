// #region imports
    // #region external
    import {
        Handler,
        StartSubscriptionMessage,
        GeneralPermissions,
        storageFields,
    } from '../../data';

    import {
        storageGet,
    } from '../../common/storage';

    import {
        log,
    } from '../../common/utilities';

    import {
        GET_ACTIVE_SESSIONS,
    } from '../graphql';

    import {
        startSessionSubscriptionLogic,
    } from '../subscriptions';

    import {
        getDefaultGraphqlClient,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleStartSubscription: Handler<StartSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    try {
        const graphqlClient = await getDefaultGraphqlClient();

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
                session.incognito,
                streamerIdentonym,
                generalPermissions,
                streamerDetails,
            );
        }

        sendResponse({
            status: true,
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
export default handleStartSubscription;
// #endregion exports
