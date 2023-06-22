// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        GENERAL_EVENT,
    } from '../../constants';

    import {
        DestreamEvent,
    } from '../events';

    import {
        Session,
        Notification,
    } from '../entities';
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
    | StopSubscriptionRequest
    | StopSubscriptionsMessage
    | GetSubscriptionMessage
    | GetTabSettingsMessage
    | GetLinkageMessage
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

export interface StopSubscriptionRequest {
    type: typeof GENERAL_EVENT.STOP_SUBSCRIPTION;
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

export interface GetLinkageMessage {
    type: typeof MESSAGE_TYPE.GET_LINKAGE;
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
// #endregion module
