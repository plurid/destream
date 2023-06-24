// #region imports
    // #region external
    import {
        MessageSender,
    } from '../../../common/types';
    // #endregion external
// #endregion imports



// #region module
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



export type Handler<R> = (
    request: R,
    sender: MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<void>;
// #endregion module
