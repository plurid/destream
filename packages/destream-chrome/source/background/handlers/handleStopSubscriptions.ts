// #region imports
    // #region external
    import {
        Handler,
        MessageStopSubscriptions,
        ResponseMessage,
    } from '../../data';

    import {
        getSubscriptionsByStreamerName,
        stopSubscription,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscriptions: Handler<MessageStopSubscriptions> = async (
    request,
    _sender,
    sendResponse,
) => {
    const subscriptions = await getSubscriptionsByStreamerName(request.data);

    for (const subscription of subscriptions) {
        await stopSubscription(subscription);
    }

    const response: ResponseMessage = {
        status: true,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleStopSubscriptions;
// #endregion exports
