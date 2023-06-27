// #region module
export const MESSAGE_BACKGROUND_TO_CONTENTSCRIPT = {
    LINKAGE_SESSION_STARTING: 'linkageSessionStarting',
    LINKAGE_SESSION_STARTED: 'linkageSessionStarted',
    LINKAGE_SESSION_ENDED: 'linkageSessionEnded',
    LINKAGE_SET_MEDIA_TIME: 'linkageSetMediaTime',

    URL_CHANGE: 'urlChange',

    STOP_SUBSCRIPTION: 'stopSubscription',
    STOP_SESSION: 'stopSession',
    START_ANOTHER_SESSION: 'startAnotherSession',
    REPLAY_SESSION: 'replaySession',

    REPLAYMENT_PAUSE: 'replaymentPause',
    REPLAYMENT_PLAY: 'replaymentPlay',
    REPLAYMENT_STOP: 'replaymentStop',
    REPLAYMENT_INDEX: 'replaymentIndex',

    RESYNC_SESSION: 'resyncSession',
} as const;

export const MESSAGE_CONTENTSCRIPT_TO_BACKGROUND = {
    GET_TAB_ID: 'getTabID',
    GET_TAB_SETTINGS: 'getTabSettings',
    GET_SESSION: 'getSession',
    GET_SUBSCRIPTION: 'getSubscription',
    GET_LINKAGE: 'getLinkage',

    URL_CHANGE: 'urlChange',

    PUBLISH_EVENT: 'publishEvent',

    STOP_SUBSCRIPTION: 'stopSubscription',
    START_SUBSCRIPTION_BY_ID: 'startSubscriptionByID',

    REPLAYMENT_INDEX: 'replaymentIndex',

    REPLAYMENT_INITIALIZE: 'replaymentInitialize',

    LINKAGE_FOCUS_SESSION_PAGE: 'linkageFocusSessionPage',
    LINKAGE_SET_MEDIA_TIME: 'linkageSetMediaTime',
    LINKAGE_CLOSE_SESSION_PAGE: 'linkageCloseSessionPage',
    LINKAGE_FOCUS_INITIAL_PAGE: 'linkageFocusInitialPage',
    LINKAGE_SESSION_ENDED: 'linkageSessionEnded',

    CHECK_SESSIONS: 'checkSessions',
} as const;

export const MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND = {
    START_SUBSCRIPTION: 'startSubscription',
    STOP_SUBSCRIPTIONS: 'stopSubscriptions',

    STOP_EVERYTHING: 'stopEverything',
} as const;

export const MESSAGE_POPUP_TO_BACKGROUND = {
    GET_SESSION: 'getSession',
    GET_SUBSCRIPTION: 'getSubscription',

    START_SESSION: 'startSession',
    STOP_SESSION: 'stopSession',
    REPLAY_SESSION: 'replaySession',

    STOP_SUBSCRIPTION: 'stopSubscription',

    REPLAYMENT_PAUSE: 'replaymentPause',
    REPLAYMENT_PLAY: 'replaymentPlay',
    REPLAYMENT_STOP: 'replaymentStop',
    REPLAYMENT_INDEX: 'replaymentIndex',

    RESYNC_SESSION: 'resyncSession',
} as const;
// #endregion module
