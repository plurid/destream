// #region imports
    // #region external
    import {
        Handler,
        StopSubscriptionMessage,
    } from '../../data';

    import {
        deleteSubscription,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscription: Handler<StopSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    deleteSubscription(request.data);

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSubscription;
// #endregion exports
