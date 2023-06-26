// #region imports
    // #region external
    import {
        Handler,
        Message,

        MESSAGE_TYPE,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MESSAGE_OPTIONS_TO_BACKGROUND,
        MESSAGE_POPUP_TO_BACKGROUND,
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
    } from '~data/index';

    import {
        log,
    } from '~common/utilities';
    // #endregion external


    // #region internal
    import handlePublishEvent from './handlePublishEvent';
    import handleGetTabID from './handleGetTabID';
    import handleGetSession from './handleGetSession';
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
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_TAB_ID]: handleGetTabID,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_TAB_SETTINGS]: handleGetTabSettings,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SESSION]: handleGetSession,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SUBSCRIPTION]: handleGetSubscription,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_LINKAGE]: handleGetLinkage,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.PUBLISH_EVENT]: handlePublishEvent,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.URL_CHANGE]: handleURLChange,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.START_SUBSCRIPTION_BY_ID]: handleStartSubscriptionByID,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.REPLAYMENT_INITIALIZE]: handleReplaymentInitialize,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.STOP_SUBSCRIPTION]: handleStopSubscription,

    [MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.START_SUBSCRIPTION]: handleStartSubscription,
    [MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_SUBSCRIPTIONS]: handleStopSubscriptions,

    [MESSAGE_POPUP_TO_BACKGROUND.GET_SESSION]: handleGetSession,
    [MESSAGE_POPUP_TO_BACKGROUND.STOP_SESSION]: handleStopSession,
    [MESSAGE_POPUP_TO_BACKGROUND.GET_SUBSCRIPTION]: handleGetSubscription,
    [MESSAGE_POPUP_TO_BACKGROUND.RESYNC_SESSION]: handleResyncSession,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAY_SESSION]: handleReplaySession,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PAUSE]: handleReplaymentPause,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PLAY]: handleReplaymentPlay,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_STOP]: handleReplaymentStop,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_INDEX]: handleReplaymentIndex,
    [MESSAGE_POPUP_TO_BACKGROUND.STOP_SUBSCRIPTION]: handleStopSubscription,
    [MESSAGE_POPUP_TO_BACKGROUND.START_SESSION]: handleStartSession,

    [MESSAGE_OPTIONS_TO_BACKGROUND.STOP_EVERYTHING]: handleStopEverything,

    [MESSAGE_TYPE.SEND_NOTIFICATION]: handleSendNotification,
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
