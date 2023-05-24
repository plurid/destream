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
    | GetSessionAudienceMessage
    | StartSessionMessage
    | StartAnotherSessionMessage
    | StopSessionMessage
    | StartSubscriptionMessage
    | StartSubscriptionByIDMessage
    | StopSubscriptionMessage
    | StopSubscriptionsMessage
    | GetSubscriptionMessage
    | GetTabSettingsMessage
    | SendNotificationMessage
    | StopEverythingMessage
    | URLChangeMessage
    | DestreamEventMessage
    | ReplaySessionMessage
    | ReplaymentPauseMessage
    | ReplaymentPlayMessage
    | ReplaymentStopMessage
    | ReplaymentIndexMessage
    | ResyncSessionMessage;

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
    publishTopic: string;
    currentStateTopic: string;
    token: string;
    endpoint: string;
    streamerDetails?: StreamerDetails;
}

export interface Subscription {
    sessionID: string;
    subscriptionID: string;
    publishTopic: string;
    currentStateTopic: string;
    startedAt: number;
    streamer: string;
    tabID: number;
    endpoint: string;
    streamerDetails?: StreamerDetails;
}

export interface StreamerDetails {
    twitchName?: string;
    useTwitch?: boolean;
    youtubeName?: string;
    useYoutube?: boolean;
}

export interface TabSettings {
    showStream: boolean;
    showStreamChat: boolean;
}

export interface Replayment {
    tabID: number;
    data: any;
    currentIndex: number;
    status: 'playing' | 'paused';
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


export interface GeneralPermissions {
    useNotifications: boolean;
    useSessionGroups: boolean;
    allowScroll: boolean;
    allowPlayPause: boolean;
    allowTimeSeek: boolean;
    allowVolumeControl: boolean;
    allowRateControl: boolean;
    allowLike: boolean;
    allowChangeURL: boolean;
    allowChangeURLAnyOrigin: boolean;
    allowedURLOrigins: string[];
};


export type DestreamEvent =
    | DestreamScrollEvent
    | DestreamURLChangeEvent
    | DestreamCurrentStateEvent
    | DestreamStopSessionEvent
    | DestreamStartAnotherSessionEvent
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

export interface DestreamURLChangeEvent {
    type: typeof GENERAL_EVENT.URL_CHANGE;
    payload: {
        url: string;
    };
}

export interface DestreamCurrentStateEvent {
    type: typeof GENERAL_EVENT.CURRENT_STATE;
    payload: any;
}

export interface DestreamStopSessionEvent {
    type: typeof GENERAL_EVENT.STOP_SESSION;
}

export interface DestreamStartAnotherSessionEvent {
    type: typeof GENERAL_EVENT.START_ANOTHER_SESSION;
    payload: {
        newSessionID: string;
    };
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

export interface GetSessionAudienceMessage {
    type: typeof MESSAGE_TYPE.GET_SESSION_AUDIENCE;
    // sessionID
    data: string;
}

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

export interface GetTabSettingsMessage {
    type: typeof MESSAGE_TYPE.GET_TAB_SETTINGS;
    // tabID
    data?: number;
}

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
    data: any;
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

export interface ResyncSessionMessage {
    type: typeof MESSAGE_TYPE.RESYNC_SESSION;
    // tab id
    data: number;
}


export interface YoutubeCurrentState {
    url: string;
    video: {
        currentTime: number;
        volume: number;
        playbackRate: number;
        paused: boolean;
    };
}




export type Handler<R> = (
    request: R,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<void>;
// #endregion module
