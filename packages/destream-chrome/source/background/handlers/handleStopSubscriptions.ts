// #region imports
    // #region external
    import {
        Handler,
        StopSubscriptionsMessage,
    } from '../../data';

    import {
        getSubscriptionsByStreamerName,
        deleteSubscription,
        removeStreamerSubscription,
    } from '../subscriptions';

    import {
        removeTabSettings,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscriptions: Handler<StopSubscriptionsMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const subscriptions = await getSubscriptionsByStreamerName(request.data);

    for (const subscription of subscriptions) {
        await deleteSubscription(subscription.sessionID);
        await removeTabSettings(subscription.tabID);
        await removeStreamerSubscription(subscription.streamer);
    }

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSubscriptions;
// #endregion exports
