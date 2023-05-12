// #region imports
    // #region external
    import {
        Handler,
        StopSubscriptionMessage,
    } from '../../data';

    import {
        getSubscription,
        stopSubscription,
    } from '../subscriptions';
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

    await stopSubscription(subscription);;

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSubscription;
// #endregion exports
