// #region imports
    // #region external
    import {
        Handler,
        MessageStopSubscription,
        ResponseMessage,
    } from '../../data';

    import {
        getSubscription,
        stopSubscription,
        getSubscriptionsByStreamerName,
        removeStreamerSubscription,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscription: Handler<MessageStopSubscription> = async (
    request,
    _sender,
    sendResponse,
) => {
    const subscription = await getSubscription(request.data);
    if (!subscription) {
        const response: ResponseMessage = {
            status: false,
        };
        sendResponse(response);

        return;
    }

    await stopSubscription(subscription);

    const streamerSubscriptions = await getSubscriptionsByStreamerName(
        subscription.streamer,
    );
    if (streamerSubscriptions.length === 0) {
        await removeStreamerSubscription(subscription.streamer);
    }

    const response: ResponseMessage = {
        status: true,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleStopSubscription;
// #endregion exports
