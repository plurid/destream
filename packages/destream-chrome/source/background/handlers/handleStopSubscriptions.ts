// #region imports
    // #region external
    import {
        Handler,
        MessageStopSubscriptions,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        getSubscriptionsByStreamerName,
        stopSubscription,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscriptions: Handler<MessageStopSubscriptions, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const subscriptions = await getSubscriptionsByStreamerName(request.data);

    for (const subscription of subscriptions) {
        await stopSubscription(subscription);
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
