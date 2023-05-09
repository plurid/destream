// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        NOTIFICATION_KIND,
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        SPOTIFY_EVENT,
        NETFLIX_EVENT,
    } from '../constants';
    // #endregion external
// #endregion imports



// #region module
export type Message =
    | PublishEventMessage
    | GetTabIDMessage
    | GetSessionMessage
    | StartSessionMessage
    | StopSessionMessage
    | StartSubscriptionMessage
    | StopSubscriptionMessage
    | StopSubscriptionsMessage
    | GetSubscriptionMessage
    | SendNotificationMessage
    | DestreamEventMessage;

export interface PublishEventMessage {
    type: typeof MESSAGE_TYPE.PUBLISH_EVENT;
    data: DestreamEvent;
}

export type PublishEventResponse =
    {
        status: false;
    } | {
        status: true;
        data: {
            token: string;
            topic: string;
            message: {
                sessionID: string;
                relativeTime: number;
                data: string;
            };
        };
    };


export interface Session {
    id: string;
    tabID: number;
    startedAt: number;
    streamer: string;
    token: string;
    endpoint: string;
}


export interface Subscription {
    sessionID: string;
    topic: string;
    startedAt: number;
    streamer: string;
    tabID: number;
    endpoint: string;
}



export type Notification =
    | {
        kind: typeof NOTIFICATION_KIND.URL_CHANGE;
        tabID: number;
        url: string;
    } | {
        kind: typeof NOTIFICATION_KIND.SESSION_START;
        tabID: number;
        streamer: string;
        url: string;
    };



export type DestreamEvent =
    | DestreamScrollEvent
    | DestreamStopSessionEvent
    | DestreamPlayEvent
    | DestreamPauseEvent
    | DestreamSeekEvent
    | DestreamVolumeChangeEvent
    | DestreamRateChangeEvent
    | DestreamLikeEvent;


export interface DestreamScrollEvent {
    type: typeof GENERAL_EVENT.SCROLL;
    payload: {
        top: number;
        left: number;
    };
}

export interface DestreamStopSessionEvent {
    type: typeof GENERAL_EVENT.STOP_SESSION;
}


export interface DestreamPlayEvent {
    type:
        | typeof YOUTUBE_EVENT.PLAY
        | typeof SPOTIFY_EVENT.PLAY
        | typeof NETFLIX_EVENT.PLAY;
}

export interface DestreamPauseEvent {
    type:
        | typeof YOUTUBE_EVENT.PAUSE
        | typeof SPOTIFY_EVENT.PAUSE
        | typeof NETFLIX_EVENT.PAUSE;
}

export interface DestreamSeekEvent {
    type:
        | typeof YOUTUBE_EVENT.SEEK
        | typeof SPOTIFY_EVENT.SEEK
        | typeof NETFLIX_EVENT.SEEK;
    // seconds
    payload: number;
}

export interface DestreamVolumeChangeEvent {
    type:
        | typeof YOUTUBE_EVENT.VOLUME_CHANGE
        | typeof SPOTIFY_EVENT.VOLUME_CHANGE
        | typeof NETFLIX_EVENT.VOLUME_CHANGE;
    // 0 - 100
    payload: number;
}

export interface DestreamRateChangeEvent {
    type:
        | typeof YOUTUBE_EVENT.RATE_CHANGE
        | typeof SPOTIFY_EVENT.RATE_CHANGE
        | typeof NETFLIX_EVENT.RATE_CHANGE;
    // 0 - 100
    payload: number;
}

export interface DestreamLikeEvent {
    type:
        | typeof YOUTUBE_EVENT.LIKE;
}



export interface GetTabIDMessage {
    type: typeof MESSAGE_TYPE.GET_TAB_ID;
}

export interface GetSessionMessage {
    type: typeof MESSAGE_TYPE.GET_SESSION;
    // tabID
    data?: number;
}

export interface StartSessionMessage {
    type: typeof MESSAGE_TYPE.START_SESSION;
    data: {
        tabID: number;
        url: string;
        title: string;
    };
}

export interface StopSessionMessage {
    type: typeof MESSAGE_TYPE.STOP_SESSION;
    data: {
        tabID: number;
        url: string;
    };
}

export interface StartSubscriptionMessage {
    type: typeof MESSAGE_TYPE.START_SUBSCRIPTION;
    // streamer identonym
    data: string;
}

export interface StopSubscriptionMessage {
    type: typeof MESSAGE_TYPE.STOP_SUBSCRIPTION;
    // session id
    data: string;
}

export interface StopSubscriptionsMessage {
    type: typeof MESSAGE_TYPE.STOP_SUBSCRIPTIONS;
    // streamer name
    data: string;
}

export interface GetSubscriptionMessage {
    type: typeof MESSAGE_TYPE.GET_SUBSCRIPTION;
    // tabID
    data?: number;
}

export interface SendNotificationMessage {
    type: typeof MESSAGE_TYPE.SEND_NOTIFICATION;
    data: Notification;
}

export interface DestreamEventMessage {
    type: typeof MESSAGE_TYPE.DESTREAM_EVENT;
    data: DestreamEvent;
}




export type Handler<R> = (
    request: R,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<void>;
// #endregion module
