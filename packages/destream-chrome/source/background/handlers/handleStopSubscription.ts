// #region imports
    // #region external
    import {
        Handler,
        StopSubscriptionMessage,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetTokens,
    } from '../../common/storage';

    import {
        generateClient,
        STOP_SESSION_SUBSCRIPTION,
    } from '../graphql';

    import {
        getSubscription,
        deleteSubscription,
        removeStreamerSubscription,
    } from '../subscriptions';

    import {
        removeTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscription: Handler<StopSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const subscription = await getSubscription(request.data);
    if (!subscription) {
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
    await graphqlClient.mutate({
        mutation: STOP_SESSION_SUBSCRIPTION,
        variables: {
            input: {
                sessionID: subscription.sessionID,
                subscriptionID: subscription.subscriptionID,
            },
        },
    });


    await deleteSubscription(subscription.sessionID);
    await removeTabSettings(subscription.tabID);
    await removeStreamerSubscription(subscription.streamer);


    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSubscription;
// #endregion exports
