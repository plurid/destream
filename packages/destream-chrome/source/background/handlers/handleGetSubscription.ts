// #region imports
    // #region external
    import {
        Handler,
        MessageGetSubscription,
        ResponseGetSubscription,
    } from '../../data';

    import {
        getSubscriptionByTabID,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSubscription: Handler<MessageGetSubscription> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab?.id;
    const subscription = await getSubscriptionByTabID(tabID);

    const response: ResponseGetSubscription = {
        status: !!subscription,
        subscription,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleGetSubscription;
// #endregion exports
