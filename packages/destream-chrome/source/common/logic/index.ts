// #region module
export const storageGetIsStreamer = async () => {
    const result = await chrome.storage.local.get(['isStreamer']);
    return !!result.isStreamer;
}

export const storageGetTokens = async () => {
    const result = await chrome.storage.local.get(['accessToken', 'refreshToken']);

    return {
        accessToken: (result.accessToken as string) || '',
        refreshToken: (result.refreshToken as string) || '',
    };
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
        identonym: '',
        accessToken: '',
        refreshToken: '',
        isStreamer: false,
        loggedIn: false,
    });
}
// #endregion module
