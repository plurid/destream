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
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<void>;
// #endregion module
