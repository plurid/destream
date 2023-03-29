// #region module
export const storageGetIsStreamer = async () => {
    const result = await chrome.storage.local.get(['isStreamer']);
    return !!result.isStreamer;
}


export const storageGetIdentonym = async (): Promise<string> => {
    const result = await chrome.storage.local.get(['identonym']);
    return result.identonym || '';
}


export const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    return tab;
}


export const logout = async () => {
    await chrome.storage.local.set({
        loginToken: '',
        identonym: '',
        isStreamer: false,
        loggedIn: false,
    });
}
// #endregion module
