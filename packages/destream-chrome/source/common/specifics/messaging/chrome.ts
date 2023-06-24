// #region module
export async function sendMessage<T = any, R = any>(data: T): Promise<R | undefined>;
export async function sendMessage<T = any, R = any>(data: T, callback?: (response: R) => void): Promise<void>;
export async function sendMessage<T = any, R = any>(
    data: T,
    callback?: (response: R) => void,
): Promise<void> {
    if (callback) {
        return chrome.runtime.sendMessage<T, R>(
            data,
            callback,
        );
    }

    return await chrome.runtime.sendMessage<T>(
        data,
    );
}


export const sendMessageToTab = async <D = any, R = any>(
    tabID: number,
    data: D,
) => {
    return await chrome.tabs.sendMessage<D, R>(
        tabID,
        data,
    );
}


export const messageAddListener = <M = any, R = any>(
    listener: (
        message: M,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: R) => void,
    ) => void,
) => {
    chrome.runtime.onMessage.addListener(listener);
}

export const messageRemoveListener = <M = any, R = any>(
    listener: (
        message: M,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: R) => void,
    ) => void,
) => {
    chrome.runtime.onMessage.addListener(listener);
}
// #endregion module
