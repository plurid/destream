// #region module
export const MESSAGE_BACKGROUND_TO_CONTENTSCRIPT = {
    LINKAGE_STARTING: 'linkageStarting',
    LINKAGE_STARTED: 'linkageStarted',
    LINKAGE_ENDED: 'linkageEnded',

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

    REPLAYMENT_INDEX: 'replaymentIndex',
} as const;

export const MESSAGE_BACKGROUND_TO_POPUP = {

} as const;

export const MESSAGE_POPUP_TO_BACKGROUND = {
    GET_SESSION: 'getSession',
    GET_SUBSCRIPTION: 'getSubscription',

    STOP_SESSION: 'stopSession',
    REPLAY_SESSION: 'replaySession',

    REPLAYMENT_PAUSE: 'replaymentPause',
    REPLAYMENT_PLAY: 'replaymentPlay',
    REPLAYMENT_STOP: 'replaymentStop',
    REPLAYMENT_INDEX: 'replaymentIndex',

    RESYNC_SESSION: 'resyncSession',
} as const;

export const MESSAGE_OPTIONS_TO_BACKGROUND = {

} as const;

export const MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND = {
    STOP_SUBSCRIPTIONS: 'stopSubscriptions',
} as const;


export const MESSAGE_TYPE = {
    GET_TAB_ID: 'getTabID',
    GET_SESSION_AUDIENCE: 'getSessionAudience',
    SEND_NOTIFICATION: 'sendNotification',
    START_SESSION: 'startSession',
    START_SUBSCRIPTION: 'startSubscription',
    START_SUBSCRIPTION_BY_ID: 'startSubscriptionByID',
    STOP_SUBSCRIPTION: 'stopSubscription',
    GET_TAB_SETTINGS: 'getTabSettings',
    GET_LINKAGE: 'getLinkage',
    STOP_EVERYTHING: 'stopEverything',
    DESTREAM_EVENT: 'destreamEvent',
    REPLAYMENT_INITIALIZE: 'replaymentInitialize',
} as const;
// #endregion module
