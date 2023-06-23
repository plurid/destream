// #region imports
    // #region external
    import {
        Handler,
        MESSAGE_TYPE,
        Message,
    } from '../../data';

    import {
        log,
    } from '../../common/utilities';
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
const handlerMapping: Record<string, Handler<Message>> = {
    [MESSAGE_TYPE.PUBLISH_EVENT]: handlePublishEvent,
    [MESSAGE_TYPE.GET_TAB_ID]: handleGetTabID,
    [MESSAGE_TYPE.GET_SESSION]: handleGetSession,
    [MESSAGE_TYPE.GET_SESSION_AUDIENCE]: handleGetSessionAudience,
    [MESSAGE_TYPE.START_SESSION]: handleStartSession,
    [MESSAGE_TYPE.STOP_SESSION]: handleStopSession,
    [MESSAGE_TYPE.START_SUBSCRIPTION]: handleStartSubscription,
    [MESSAGE_TYPE.START_SUBSCRIPTION_BY_ID]: handleStartSubscriptionByID,
    [MESSAGE_TYPE.STOP_SUBSCRIPTION]: handleStopSubscription,
    [MESSAGE_TYPE.STOP_SUBSCRIPTIONS]: handleStopSubscriptions,
    [MESSAGE_TYPE.GET_SUBSCRIPTION]: handleGetSubscription,
    [MESSAGE_TYPE.GET_TAB_SETTINGS]: handleGetTabSettings,
    [MESSAGE_TYPE.GET_LINKAGE]: handleGetLinkage,
    [MESSAGE_TYPE.SEND_NOTIFICATION]: handleSendNotification,
    [MESSAGE_TYPE.STOP_EVERYTHING]: handleStopEverything,
    [MESSAGE_TYPE.URL_CHANGE]: handleURLChange,
    [MESSAGE_TYPE.REPLAY_SESSION]: handleReplaySession,
    [MESSAGE_TYPE.REPLAYMENT_PAUSE]: handleReplaymentPause,
    [MESSAGE_TYPE.REPLAYMENT_PLAY]: handleReplaymentPlay,
    [MESSAGE_TYPE.REPLAYMENT_STOP]: handleReplaymentStop,
    [MESSAGE_TYPE.REPLAYMENT_INDEX]: handleReplaymentIndex,
    [MESSAGE_TYPE.REPLAYMENT_INITIALIZE]: handleReplaymentInitialize,
    [MESSAGE_TYPE.RESYNC_SESSION]: handleResyncSession,
};


const messageHandler: Handler<Message> = async (
    request,
    sender,
    sendResponse,
) => {
    const handler = handlerMapping[request.type];
    if (!handler) {
        log(`handler not found for ${request.type}`);
        return;
    }

    return handler(request, sender, sendResponse);
}
// #endregion module



// #region exports
export default messageHandler;
// #endregion exports
