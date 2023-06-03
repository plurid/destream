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
