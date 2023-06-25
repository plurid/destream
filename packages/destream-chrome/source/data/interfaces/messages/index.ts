// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MESSAGE_POPUP_TO_BACKGROUND,
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
        GENERAL_EVENT,
    } from '../../constants';

    import {
        DestreamEvent,
    } from '../events';

    import {
        Notification,
        Session,
        Subscription,
        TabSettings,
    } from '../entities';

    import {
       DestreamLinkage,
    } from '../linkage';
    // #endregion external
// #endregion imports



// #region module
export type Message =
    | MessagePublishEvent
    | MessageGetTabID
    | MessageGetSession
    | MessageGetSessionAudience
    | StartSessionMessage
    | MessageStartAnotherSession
    | MessageStopSession
    | RequestStopSession
    | StartSubscriptionMessage
    | StartSubscriptionByIDMessage
    | MessageStopSubscription
    | RequestStopSubscription
    | MessageStopSubscriptions
    | MessageGetSubscription
    | MessageGetTabSettings
    | MessageGetLinkage
    | SendNotificationMessage
    | StopEverythingMessage
    | MessageURLChange
    | RequestURLChange
    | DestreamEventMessage
    | MessageReplaySession
    | RequestReplaySession
    | MessageReplaymentPause
    | RequestReplaymentPause
    | MessageReplaymentPlay
    | RequestReplaymentPlay
    | MessageReplaymentStop
    | RequestReplaymentStop
    | MessageReplaymentIndex
    | ReplaymentInitializeMessage
    | LinkageStartingMessage
    | LinkageStartedMessage
    | LinkageEndedMessage
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


export interface MessageGetSessionAudience {
    type: typeof MESSAGE_TYPE.GET_SESSION_AUDIENCE;
    // sessionID
    data: string;
}
export type ResponseGetSessionAudience = Response<{
    audience: number;
}>;

export interface StartSessionMessage {
    type: typeof MESSAGE_TYPE.START_SESSION;
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

export interface StartSubscriptionMessage {
    type: typeof MESSAGE_TYPE.START_SUBSCRIPTION;
    // streamer identonym
    data: string;
}

export interface StartSubscriptionByIDMessage {
    type: typeof MESSAGE_TYPE.START_SUBSCRIPTION_BY_ID;
    // session id
    data: string;
}

export interface MessageStopSubscription {
    type: typeof MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.STOP_SUBSCRIPTION;
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
    type: typeof MESSAGE_TYPE.GET_TAB_SETTINGS;
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

export interface SendNotificationMessage {
    type: typeof MESSAGE_TYPE.SEND_NOTIFICATION;
    data: Notification;
}

export interface StopEverythingMessage {
    type: typeof MESSAGE_TYPE.STOP_EVERYTHING;
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

export interface DestreamEventMessage {
    type: typeof MESSAGE_TYPE.DESTREAM_EVENT;
    data: DestreamEvent;
}

export interface MessageReplaySession {
    type: typeof MESSAGE_POPUP_TO_BACKGROUND.REPLAY_SESSION;
    // session data
    data: any;
    linkage?: boolean;
}
export interface RequestReplaySession {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION;
    // session data
    data: any;
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

export interface ReplaymentInitializeMessage {
    type: typeof MESSAGE_TYPE.REPLAYMENT_INITIALIZE;
    // session id
    data: string;
    linkageID?: string;
}

export interface LinkageStartingMessage {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTING;
    // linkage id
    data: string;
}

export interface LinkageStartedMessage {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTED;
    // linkage id
    data: string;
}

export interface LinkageEndedMessage {
    type: typeof MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_ENDED;
    // linkage id
    data: string;
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
