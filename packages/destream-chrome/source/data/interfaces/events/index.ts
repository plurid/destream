// #region imports
    // #region external
    import {
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        TWITCH_EVENT,
        SPOTIFY_EVENT,
        NETFLIX_EVENT,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export type DestreamEvent =
    | DestreamInitialStateEvent
    | DestreamScrollEvent
    | DestreamCursorEvent
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


export interface DestreamInitialStateEvent {
    type: typeof GENERAL_EVENT.INITIAL_STATE;
    payload: any;
}

export interface DestreamScrollEvent {
    type: typeof GENERAL_EVENT.SCROLL;
    payload: {
        top: number;
        left: number;
    };
}

export interface DestreamCursorEvent {
    type: typeof GENERAL_EVENT.CURSOR;
    payload: {
        x: number;
        y: number;
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
        | typeof GENERAL_EVENT.PLAY
        | typeof YOUTUBE_EVENT.PLAY
        | typeof TWITCH_EVENT.PLAY
        | typeof SPOTIFY_EVENT.PLAY
        | typeof NETFLIX_EVENT.PLAY;
}

export interface DestreamPauseEvent {
    type:
        | typeof GENERAL_EVENT.PAUSE
        | typeof YOUTUBE_EVENT.PAUSE
        | typeof TWITCH_EVENT.PAUSE
        | typeof SPOTIFY_EVENT.PAUSE
        | typeof NETFLIX_EVENT.PAUSE;
}

export interface DestreamSeekEvent {
    type:
        | typeof GENERAL_EVENT.SEEK
        | typeof YOUTUBE_EVENT.SEEK
        | typeof TWITCH_EVENT.SEEK
        | typeof SPOTIFY_EVENT.SEEK
        | typeof NETFLIX_EVENT.SEEK;
    // seconds
    payload: number;
}

export interface DestreamVolumeChangeEvent {
    type:
        | typeof GENERAL_EVENT.VOLUME_CHANGE
        | typeof YOUTUBE_EVENT.VOLUME_CHANGE
        | typeof TWITCH_EVENT.VOLUME_CHANGE
        | typeof SPOTIFY_EVENT.VOLUME_CHANGE
        | typeof NETFLIX_EVENT.VOLUME_CHANGE;
    // 0 - 100
    payload: number;
}

export interface DestreamRateChangeEvent {
    type:
        | typeof GENERAL_EVENT.RATE_CHANGE
        | typeof YOUTUBE_EVENT.RATE_CHANGE
        | typeof TWITCH_EVENT.RATE_CHANGE
        | typeof SPOTIFY_EVENT.RATE_CHANGE
        | typeof NETFLIX_EVENT.RATE_CHANGE;
    // 0 - 100
    payload: number;
}

export interface DestreamLikeEvent {
    type:
        | typeof YOUTUBE_EVENT.LIKE;
}
// #endregion module
