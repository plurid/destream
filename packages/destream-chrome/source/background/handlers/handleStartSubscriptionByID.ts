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
        assignTabToGroup,
    } from '../utilities';
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


    const generalPermissions: GeneralPermissions = await storageGet(storageFields.generalPermissions);


    const sessionSubscription = await graphqlClient.mutate({
        mutation: START_SESSION_SUBSCRIPTION,
        variables: {
            input: {
                value: sessionID,
            },
        },
    });
    const sessionSubscriptionResponse = sessionSubscription.data.destreamStartSessionSubscription;
    if (!sessionSubscriptionResponse.status) {
        sendResponse({
            status: false,
        });
        return;
    }

    const {
        session,
        streamerDetails,
    } = sessionSubscriptionResponse.data;

    const tab = await openTab(session.url);
    await assignTabToGroup(tab, session.streamer, generalPermissions);

    const pubsubEndpoint = session.customPubSubLink || DEFAULT_API_ENDPOINT;

    if (generalPermissions?.useNotifications) {
        sendNotificationSessionStart(
            session.streamer,
            tab.id,
            session.url,
        );
    }

    await startSubscription(
        session.streamer,
        streamerDetails,
        sessionID,
        sessionSubscriptionResponse.data,
        pubsubEndpoint,
        tab.id,
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
