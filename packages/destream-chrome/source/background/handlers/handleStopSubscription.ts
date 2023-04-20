// #region imports
    // #region external
    import {
        Handler,
        StopSubscriptionMessage,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleStopSubscription: Handler<StopSubscriptionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    // subscriptionManager.remove(request.data);

    // remove subscription
    // await deleteSession(request.data.tabID);

    sendResponse({
        status: true,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSubscription;
// #endregion exports
