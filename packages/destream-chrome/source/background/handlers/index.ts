// #region imports
    // #region external
    import {
        Handler,
        Message,

        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
        MESSAGE_POPUP_TO_BACKGROUND,
    } from '~data/index';

    import {
        trace,
        log,
    } from '~common/utilities';
    // #endregion external


    // #region internal
    import handleCheckSessions from './handleCheckSessions';
    import handleGetGeneralPermissions from './handleGetGeneralPermissions';
    import handleGetLinkage from './handleGetLinkage';
    import handleGetSession from './handleGetSession';
    import handleGetSubscription from './handleGetSubscription';
    import handleGetTabID from './handleGetTabID';
    import handleGetTabSettings from './handleGetTabSettings';
    import handleLinkageCloseSessionPage from './handleLinkageCloseSessionPage';
    import handleLinkageFocusInitialPage from './handleLinkageFocusInitialPage';
    import handleLinkageFocusSessionPage from './handleLinkageFocusSessionPage';
    import handleLinkageSessionEnded from './handleLinkageSessionEnded';
    import handleLinkageSetMediaTime from './handleLinkageSetMediaTime';
    import handlePublishEvent from './handlePublishEvent';
    import handleReplaymentIndex from './handleReplaymentIndex';
    import handleReplaymentInitialize from './handleReplaymentInitialize';
    import handleReplaymentPause from './handleReplaymentPause';
    import handleReplaymentPlay from './handleReplaymentPlay';
    import handleReplaymentStop from './handleReplaymentStop';
    import handleReplaySession from './handleReplaySession';
    import handleResyncSession from './handleResyncSession';
    import handleStartSession from './handleStartSession';
    import handleStartSubscription from './handleStartSubscription';
    import handleStartSubscriptionByID from './handleStartSubscriptionByID';
    import handleStopEverything from './handleStopEverything';
    import handleStopSession from './handleStopSession';
    import handleStopSubscription from './handleStopSubscription';
    import handleStopSubscriptions from './handleStopSubscriptions';
    import handleURLChange from './handleURLChange';
    // #endregion internal
// #endregion imports



// #region module
const handlerMapping = {
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.CHECK_SESSIONS]: handleCheckSessions,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_GENERAL_PERMISSIONS]: handleGetGeneralPermissions,
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
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_SESSION_PAGE]: handleLinkageFocusSessionPage,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_SET_MEDIA_TIME]: handleLinkageSetMediaTime,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_CLOSE_SESSION_PAGE]: handleLinkageCloseSessionPage,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_INITIAL_PAGE]: handleLinkageFocusInitialPage,
    [MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_SESSION_ENDED]: handleLinkageSessionEnded,

    [MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.START_SUBSCRIPTION]: handleStartSubscription,
    [MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_SUBSCRIPTIONS]: handleStopSubscriptions,
    [MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_EVERYTHING]: handleStopEverything,

    [MESSAGE_POPUP_TO_BACKGROUND.GET_SESSION]: handleGetSession,
    [MESSAGE_POPUP_TO_BACKGROUND.START_SESSION]: handleStartSession,
    [MESSAGE_POPUP_TO_BACKGROUND.STOP_SESSION]: handleStopSession,
    [MESSAGE_POPUP_TO_BACKGROUND.GET_SUBSCRIPTION]: handleGetSubscription,
    [MESSAGE_POPUP_TO_BACKGROUND.STOP_SUBSCRIPTION]: handleStopSubscription,
    [MESSAGE_POPUP_TO_BACKGROUND.RESYNC_SESSION]: handleResyncSession,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAY_SESSION]: handleReplaySession,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PAUSE]: handleReplaymentPause,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PLAY]: handleReplaymentPlay,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_STOP]: handleReplaymentStop,
    [MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_INDEX]: handleReplaymentIndex,
};


const messageHandler: Handler<Message> = async (
    request,
    sender,
    sendResponse,
) => {
    trace(`background message ${request.type}`, request);

    const handler: Handler<Message> | undefined = (handlerMapping as any)[request.type];
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
