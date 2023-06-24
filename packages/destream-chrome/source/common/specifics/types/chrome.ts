// #region module
export type StorageChange = chrome.storage.StorageChange;


export type Tab = chrome.tabs.Tab;
export type TabChangeInfo = chrome.tabs.TabChangeInfo;

export type Window = chrome.windows.Window;


export type MessageSender = chrome.runtime.MessageSender;
export type MessageListener<Request = any, Response = any> = (
    request: Request,
    sender: MessageSender,
    sendResponse: (response?: Response) => void,
) => void;
// #endregion module
