// #region imports
    // #region external
    import {
        MessageSender,
    } from '~common/types';
    // #endregion external
// #endregion imports



// #region module
export type Handler<RQ = any, RS = any> = (
    request: RQ,
    sender: MessageSender,
    sendResponse: (response?: RS) => void,
) => Promise<void>;


export interface LinkageOfURL {
    streamerName: string;
    linkageID: string;
    linkageName: string;
}
// #endregion module
