// #region module
export const MESSAGE_BACKGROUND_TO_CONTENTSCRIPT = {
    LINKAGE_STARTING: 'linkageStarting',
    LINKAGE_STARTED: 'linkageStarted',
    LINKAGE_ENDED: 'linkageEnded',
} as const;

export const MESSAGE_CONTENTSCRIPT_TO_BACKGROUND = {
    GET_TAB_ID: 'getTabID',
    GET_TAB_SETTINGS: 'getTabSettings',
    GET_SESSION: 'getSession',
    GET_SUBSCRIPTION: 'getSubscription',
    GET_LINKAGE: 'getLinkage',
    PUBLISH_EVENT: 'publishEvent',
} as const;

export const MESSAGE_BACKGROUND_TO_POPUP = {

} as const;

export const MESSAGE_POPUP_TO_BACKGROUND = {
    GET_SESSION: 'getSession',
    GET_SUBSCRIPTION: 'getSubscription',

    REPLAY_SESSION: 'replaySession',
} as const;

export const MESSAGE_BACKGROUND_OPTIONS = {

} as const;


export const MESSAGE_TYPE = {
    PUBLISH_EVENT: 'publishEvent',
    GET_TAB_ID: 'getTabID',
    GET_SESSION: 'getSession',
    GET_SESSION_AUDIENCE: 'getSessionAudience',
    SEND_NOTIFICATION: 'sendNotification',
    START_SESSION: 'startSession',
    STOP_SESSION: 'stopSession',
    START_SUBSCRIPTION: 'startSubscription',
    START_SUBSCRIPTION_BY_ID: 'startSubscriptionByID',
    STOP_SUBSCRIPTION: 'stopSubscription',
    STOP_SUBSCRIPTIONS: 'stopSubscriptions',
    GET_SUBSCRIPTION: 'getSubscription',
    GET_TAB_SETTINGS: 'getTabSettings',
    GET_LINKAGE: 'getLinkage',
    STOP_EVERYTHING: 'stopEverything',
    URL_CHANGE: 'urlChange',
    DESTREAM_EVENT: 'destreamEvent',
    REPLAY_SESSION: 'replaySession',
    REPLAYMENT_PAUSE: 'replaymentPause',
    REPLAYMENT_PLAY: 'replaymentPlay',
    REPLAYMENT_STOP: 'replaymentStop',
    REPLAYMENT_INDEX: 'replaymentIndex',
    REPLAYMENT_INITIALIZE: 'replaymentInitialize',
    LINKAGE_STARTING: 'linkageStarting',
    LINKAGE_STARTED: 'linkageStarted',
    LINKAGE_ENDED: 'linkageEnded',
    RESYNC_SESSION: 'resyncSession',
} as const;
// #endregion module
