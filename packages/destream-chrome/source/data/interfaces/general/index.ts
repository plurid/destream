// #region imports
    // #region external
    import {
        MessageSender,
    } from '../../../common/types';
    // #endregion external
// #endregion imports



// #region module
export type Handler<R> = (
    request: R,
    sender: MessageSender,
    sendResponse: (response?: any) => void,
) => Promise<void>;


export interface LinkageOfURL {
    streamerName: string;
    linkageID: string;
    linkageName: string;
}
// #endregion module
