// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
    } from '../constants';
    // #endregion external
// #endregion imports



// #region module
export interface DestreamEvent {
    type: string;
    payload?: any;
}


export type Message =
    | PublishEventMessage
    | GetTabIDMessage
    | GetSessionMessage
    | SendNotificationMessage;

export interface PublishEventMessage {
    type: typeof MESSAGE_TYPE.PUBLISH_EVENT;
    data: any;
}

export interface GetTabIDMessage {
    type: typeof MESSAGE_TYPE.GET_TAB_ID;
}

export interface GetSessionMessage {
    type: typeof MESSAGE_TYPE.GET_SESSION;
}

export interface SendNotificationMessage {
    type: typeof MESSAGE_TYPE.SEND_NOTIFICATION;
    data: any;
}
// #endregion module
