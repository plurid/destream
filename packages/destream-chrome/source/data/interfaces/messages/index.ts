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
    | StartAnotherSessionMessage
    | StopSessionMessage
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
    | URLChangeMessage
    | DestreamEventMessage
    | ReplaySessionMessage
    | ReplaymentPauseMessage
    | ReplaymentPlayMessage
    | ReplaymentStopMessage
    | ReplaymentIndexMessage
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

export interface StartAnotherSessionMessage {
    type: typeof GENERAL_EVENT.START_ANOTHER_SESSION;
    data: {
        session: Session;
        newSessionID: string;
    };
}

export interface StopSessionMessage {
    type: typeof MESSAGE_TYPE.STOP_SESSION;
    data: {
        tabID: number;
        url: string;
    };
}

// Request sent from background to contentscript.
export interface StopSessionRequest {
    type: typeof GENERAL_EVENT.STOP_SESSION;
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

export interface URLChangeMessage {
    type: typeof MESSAGE_TYPE.URL_CHANGE;
    // url
    data: string;
}

export interface URLChangeRequest {
    type: typeof GENERAL_EVENT.URL_CHANGE;
    session: Session;
    url: string;
}

export interface DestreamEventMessage {
    type: typeof MESSAGE_TYPE.DESTREAM_EVENT;
    data: DestreamEvent;
}

export interface ReplaySessionMessage {
    type: typeof MESSAGE_TYPE.REPLAY_SESSION;
    // session data
    data: any;
    linkage?: boolean;
}

export interface ReplaymentPauseMessage {
    type: typeof MESSAGE_TYPE.REPLAYMENT_PAUSE;
    // tab id
    data: number;
}

export interface ReplaymentPlayMessage {
    type: typeof MESSAGE_TYPE.REPLAYMENT_PLAY;
    // tab id
    data: number;
}

export interface ReplaymentStopMessage {
    type: typeof MESSAGE_TYPE.REPLAYMENT_STOP;
    // tab id
    data: number;
}

export interface ReplaymentIndexMessage {
    type: typeof MESSAGE_TYPE.REPLAYMENT_INDEX;
    data: {
        tabID: number;
        index: number;
        updateTab?: boolean;
    };
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
