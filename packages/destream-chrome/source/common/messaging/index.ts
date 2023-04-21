// #region module
export async function sendMessage<T = any, R = any>(data: T): Promise<R>;
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
// #endregion module
