// #region imports
    // #region external
    import {
        Handler,
        GetSubscriptionMessage,
    } from '../../data';

    import {
        getSubscriptionByTabID,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSubscription: Handler<GetSubscriptionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab.id;
    const subscription = await getSubscriptionByTabID(tabID);

    sendResponse({
        status: !!subscription,
        subscription,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetSubscription;
// #endregion exports
