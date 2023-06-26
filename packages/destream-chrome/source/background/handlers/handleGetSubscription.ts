// #region imports
    // #region external
    import {
        Handler,
        MessageGetSubscription,
        ResponseGetSubscription,
    } from '~data/interfaces';

    import {
        getSubscriptionByTabID,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSubscription: Handler<MessageGetSubscription, ResponseGetSubscription> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab?.id;
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
