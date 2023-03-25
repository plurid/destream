// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        DESTREAM_EVENT,
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
    | StartSessionMessage
    | GetSessionMessage
    | StopControlMessage
    | SendNotificationMessage
    | DestreamEventMessage;

export interface PublishEventMessage {
    type: typeof MESSAGE_TYPE.PUBLISH_EVENT;
    data: DestreamEvent;
}


export type DestreamEvent =
    | DestreamScrollEvent
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

export interface StartSessionMessage {
    type: typeof MESSAGE_TYPE.START_SESSION;
    // tab URL
    data: string;
}

export interface GetSessionMessage {
    type: typeof MESSAGE_TYPE.GET_SESSION;
    // tabID
    data: number;
}

export interface StopControlMessage {
    type: typeof MESSAGE_TYPE.STOP_CONTROL;
    // tabID
    data: number;
}

export interface SendNotificationMessage {
    type: typeof MESSAGE_TYPE.SEND_NOTIFICATION;
    data: any;
}

export interface DestreamEventMessage {
    type: typeof MESSAGE_TYPE.DESTREAM_EVENT;
    data: DestreamEvent;
}
// #endregion module
