// #region imports
    // #region external
    import {
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MESSAGE_POPUP_TO_BACKGROUND,
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
    } from '~data/constants';

    import {
        DestreamEvent,
    } from '../events';

    import {
        Session,
        Subscription,
        TabSettings,
    } from '../entities';

    import {
       DestreamLinkage,
    } from '../linkage';

    import {
       DestreamSession,
    } from '../session';
    // #endregion external
// #endregion imports



// #region module
export type Message =
    | MessagePublishEvent
    | MessageCheckSessions
    | MessageGetTabID
    | MessageGetSession
    | MessageStartSession
    | MessageStartAnotherSession
    | MessageStopSession
    | RequestStopSession
    | MessageStartSubscription
    | MessageStartSubscriptionByID
    | MessageStopSubscription
    | RequestStopSubscription
    | MessageStopSubscriptions
    | MessageGetSubscription
    | MessageGetTabSettings
    | MessageGetLinkage
    | MessageStopEverything
    | MessageURLChange
    | RequestURLChange
    | MessageReplaySession
    | RequestReplaySession
    | MessageReplaymentPause
    | RequestReplaymentPause
    | MessageReplaymentPlay
    | RequestReplaymentPlay
    | MessageReplaymentStop
    | RequestReplaymentStop
    | MessageReplaymentIndex
    | MessageReplaymentInitialize
    | MessageLinkageSessionStarting
    | MessageLinkageSessionStarted
    | MessageLinkageSessionEnded
    | MessagerLinkageFocusSessionPage
    | MessagerLinkageCloseSessionPage
    | MessagerLinkageSetMediaTime
    | RequestLinkageSetMediaTime
    | MessagerLinkageFocusInitialPage
    | MessagerLinkageSessionEnded
    | MessageResyncSession
    | RequestResyncSession;


export type Response<T> = {
        status: false;
    } | {
        status: true;
    } & T;

export type ResponseMessage = Response<{}>;



export interface MessagePublishEvent {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.PUBLISH_EVENT;
    data: DestreamEvent;
}
export type ResponsePublishEvent = Response<{
    data: {
        token: string;
        topic: string;
        message: {
            sessionID: string;
            relativeTime: number;
            data: string;
        };
    };
}>;

export interface MessageCheckSessions {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.CHECK_SESSIONS;
}

export interface MessageGetTabID {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_TAB_ID;
}
export type ResponseGetTabID = Response<{
    tabID: number;
}>;

export interface MessageGetSession {
    type:
        | typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SESSION
        | typeof MESSAGE_POPUP_TO_BACKGROUND.GET_SESSION;
    // tabID
    data?: number;
}
export type ResponseGetSession = Response<{
    session: Session;
}>;

export interface MessageStartSession {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.START_SESSION;
    data: {
        tabID: number;
        url: string;
        title: string;
    };
}

export interface MessageStartAnotherSession {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.START_ANOTHER_SESSION;
    data: {
        session: Session;
        newSessionID: string;
    };
}

export interface MessageStopSession {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.STOP_SESSION;
    data: {
        tabID: number;
        url: string;
    };
}
export interface RequestStopSession {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SESSION;
    session: Session;
}

export interface MessageStartSubscription {
    type: typeof MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.START_SUBSCRIPTION;
    // streamer identonym
    data: string;
}

export interface MessageStartSubscriptionByID {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.START_SUBSCRIPTION_BY_ID;
    // session id
    data: string;
}

export interface MessageStopSubscription {
    type:
        | typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.STOP_SUBSCRIPTION
        | typeof MESSAGE_POPUP_TO_BACKGROUND.STOP_SUBSCRIPTION;
    // session id
    data: string;
}
export interface RequestStopSubscription {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SUBSCRIPTION;
}

export interface MessageStopSubscriptions {
    type: typeof MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_SUBSCRIPTIONS;
    // streamer name
    data: string;
}

export interface MessageGetSubscription {
    type:
        | typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SUBSCRIPTION
        | typeof MESSAGE_POPUP_TO_BACKGROUND.GET_SUBSCRIPTION;
    // tabID
    data?: number;
}
export type ResponseGetSubscription = Response<{
    subscription: Subscription;
}>;

export interface MessageGetTabSettings {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_TAB_SETTINGS;
    // tabID
    data?: number;
}
export type ResponseGetTabSettings = Response<{
    tabSettings: TabSettings;
}>;

export interface MessageGetLinkage {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_LINKAGE;
    // tabID
    data?: number;
}
export type ResponseGetLinkage = Response<{
    linkage: DestreamLinkage;
}>;

export interface MessageStopEverything {
    type: typeof MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_EVERYTHING;
}

export interface MessageURLChange {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.URL_CHANGE;
    // url
    data: string;
}
export interface RequestURLChange {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.URL_CHANGE;
    session: Session;
    url: string;
}

export interface MessageReplaySession {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.REPLAY_SESSION;
    // session data
    data: DestreamSession;
    linkageID?: string;
}
export interface RequestReplaySession {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION;
    // session data
    data: DestreamSession;
}

export interface MessageReplaymentPause {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PAUSE;
    // tab id
    data: number;
}
export interface RequestReplaymentPause {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PAUSE;
}

export interface MessageReplaymentPlay {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_PLAY;
    // tab id
    data: number;
}
export interface RequestReplaymentPlay {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PLAY;
    reset?: boolean;
}

export interface MessageReplaymentStop {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.REPLAYMENT_STOP;
    // tab id
    data: number;
}
export interface RequestReplaymentStop {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_STOP;
}

export interface MessageReplaymentIndex {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.REPLAYMENT_INDEX;
    data: {
        tabID: number;
        index: number;
        updateTab?: boolean;
    };
}
export interface RequestReplaymentIndex {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_INDEX;
    data: number;
}

export interface MessageReplaymentInitialize {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.REPLAYMENT_INITIALIZE;
    // session id
    data: string;
    linkageID?: string;
}

export interface MessageLinkageSessionStarting {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_STARTING;
    // linkage id
    data: string;
}

export interface MessageLinkageSessionStarted {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_STARTED;
    // linkage id
    data: string;
}

export interface MessageLinkageSessionEnded {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_ENDED;
    // linkage id
    data: string;
}

export interface MessagerLinkageFocusSessionPage {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_SESSION_PAGE;
    sessionID: string;
    linkageID: string;
}

export interface MessagerLinkageCloseSessionPage {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_CLOSE_SESSION_PAGE;
    sessionID: string;
    linkageID: string;
}

export interface MessagerLinkageSetMediaTime {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_SET_MEDIA_TIME;
    sessionID: string;
    linkageID: string;
    data: number;
}
export interface RequestLinkageSetMediaTime {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SET_MEDIA_TIME;
    data: number;
}

export interface MessagerLinkageFocusInitialPage {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_INITIAL_PAGE;
    sessionID: string;
    linkageID: string;
}

export interface MessagerLinkageSessionEnded {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_SESSION_ENDED;
    sessionID: string;
    linkageID: string;
}

export interface MessageResyncSession {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.RESYNC_SESSION;
    // tab id
    data: number;
}
export interface RequestResyncSession {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.RESYNC_SESSION;
}
// #endregion module
