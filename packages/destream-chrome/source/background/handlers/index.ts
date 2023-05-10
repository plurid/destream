// #region imports
    // #region external
    import {
        Handler,
        MESSAGE_TYPE,
        Message,
    } from '../../data';
    // #endregion external


    // #region internal
    import handlePublishEvent from './handlePublishEvent';
    import handleGetTabID from './handleGetTabID';
    import handleGetSession from './handleGetSession';
    import handleStartSession from './handleStartSession';
    import handleStopSession from './handleStopSession';
    import handleStartSubscription from './handleStartSubscription';
    import handleStopSubscription from './handleStopSubscription';
    import handleStopSubscriptions from './handleStopSubscriptions';
    import handleGetSubscription from './handleGetSubscription';
    import handleSendNotification from './handleSendNotification';
    import handleStopEverything from './handleStopEverything';
    // #endregion internal
// #endregion imports



// #region module
const messageHandler: Handler<Message> = async (
    request,
    sender,
    sendResponse,
) => {
    switch (request.type) {
        case MESSAGE_TYPE.PUBLISH_EVENT:
            return handlePublishEvent(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_TAB_ID:
            return handleGetTabID(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_SESSION:
            return handleGetSession(request, sender, sendResponse);
        case MESSAGE_TYPE.START_SESSION:
            return handleStartSession(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SESSION:
            return handleStopSession(request, sender, sendResponse);
        case MESSAGE_TYPE.START_SUBSCRIPTION:
            return handleStartSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SUBSCRIPTION:
            return handleStopSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SUBSCRIPTIONS:
            return handleStopSubscriptions(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_SUBSCRIPTION:
            return handleGetSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.SEND_NOTIFICATION:
            return handleSendNotification(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_EVERYTHING:
            return handleStopEverything(request, sender, sendResponse);
        default:
            return;
    }
}
// #endregion module



// #region exports
export default messageHandler;
// #endregion exports
