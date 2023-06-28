// #region imports
    // #region external
    import {
        NOTIFICATION_KIND,
    } from '~data/constants';

    import {
        DestreamLinkage,
    } from '../linkage';

    import {
        DestreamSession,
    } from '../session';
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
    streamer: string;
    data: DestreamSession;
    currentIndex: number;
    status: 'playing' | 'paused';
    duration: number;
    linkageID?: string;
}



export interface Linkage extends DestreamLinkage {
    tabID: number;
    sessionTabs: Record<string, number | undefined>;
    endedSessions: number;
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
    useTelemetry: boolean;
    useNotifications: boolean;
    useSessionGroups: boolean;
    autoCheckSessions: boolean;
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
    allowedOriginsStreamers: string[];
};
// #endregion module
