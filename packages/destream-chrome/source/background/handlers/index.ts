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
    import handleGetSessionAudience from './handleGetSessionAudience';
    import handleStartSession from './handleStartSession';
    import handleStopSession from './handleStopSession';
    import handleStartSubscription from './handleStartSubscription';
    import handleStartSubscriptionByID from './handleStartSubscriptionByID';
    import handleStopSubscription from './handleStopSubscription';
    import handleStopSubscriptions from './handleStopSubscriptions';
    import handleGetSubscription from './handleGetSubscription';
    import handleGetTabSettings from './handleGetTabSettings';
    import handleGetLinkage from './handleGetLinkage';
    import handleSendNotification from './handleSendNotification';
    import handleStopEverything from './handleStopEverything';
    import handleURLChange from './handleURLChange';
    import handleReplaySession from './handleReplaySession';
    import handleReplaymentPause from './handleReplaymentPause';
    import handleReplaymentPlay from './handleReplaymentPlay';
    import handleReplaymentStop from './handleReplaymentStop';
    import handleReplaymentIndex from './handleReplaymentIndex';
    import handleReplaymentInitialize from './handleReplaymentInitialize';
    import handleResyncSession from './handleResyncSession';
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
        case MESSAGE_TYPE.GET_SESSION_AUDIENCE:
            return handleGetSessionAudience(request, sender, sendResponse);
        case MESSAGE_TYPE.START_SESSION:
            return handleStartSession(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SESSION:
            return handleStopSession(request, sender, sendResponse);
        case MESSAGE_TYPE.START_SUBSCRIPTION:
            return handleStartSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.START_SUBSCRIPTION_BY_ID:
            return handleStartSubscriptionByID(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SUBSCRIPTION:
            return handleStopSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_SUBSCRIPTIONS:
            return handleStopSubscriptions(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_SUBSCRIPTION:
            return handleGetSubscription(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_TAB_SETTINGS:
            return handleGetTabSettings(request, sender, sendResponse);
        case MESSAGE_TYPE.GET_LINKAGE:
            return handleGetLinkage(request, sender, sendResponse);
        case MESSAGE_TYPE.SEND_NOTIFICATION:
            return handleSendNotification(request, sender, sendResponse);
        case MESSAGE_TYPE.STOP_EVERYTHING:
            return handleStopEverything(request, sender, sendResponse);
        case MESSAGE_TYPE.URL_CHANGE:
            return handleURLChange(request, sender, sendResponse);
        case MESSAGE_TYPE.REPLAY_SESSION:
            return handleReplaySession(request, sender, sendResponse);
        case MESSAGE_TYPE.REPLAYMENT_PAUSE:
            return handleReplaymentPause(request, sender, sendResponse);
        case MESSAGE_TYPE.REPLAYMENT_PLAY:
            return handleReplaymentPlay(request, sender, sendResponse);
        case MESSAGE_TYPE.REPLAYMENT_STOP:
            return handleReplaymentStop(request, sender, sendResponse);
        case MESSAGE_TYPE.REPLAYMENT_INDEX:
            return handleReplaymentIndex(request, sender, sendResponse);
        case MESSAGE_TYPE.REPLAYMENT_INITIALIZE:
            return handleReplaymentInitialize(request, sender, sendResponse);
        case MESSAGE_TYPE.RESYNC_SESSION:
            return handleResyncSession(request, sender, sendResponse);
        default:
            return;
    }
}
// #endregion module



// #region exports
export default messageHandler;
// #endregion exports
