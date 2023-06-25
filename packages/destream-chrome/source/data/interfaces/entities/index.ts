// #region imports
    // #region external
    import {
        NOTIFICATION_KIND,
    } from '../../constants';

    import {
        DestreamLinkage,
    } from '../linkage';
    // #endregion external
// #endregion imports



// #region module
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
    streamCursor: boolean;
    showEventsList: boolean;
    showStream: boolean;
    showStreamChat: boolean;
}

export interface Replayment {
    tabID: number;
    data: any;
    currentIndex: number;
    status: 'playing' | 'paused';
    duration: number;
}


export interface Linkage extends DestreamLinkage {
    tabID: number;
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
    autoCheckLinkages: boolean;
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
// #endregion module
