// #region module
export const storageGetIsStreamer = async () => {
    const result = await chrome.storage.local.get(['isStreamer']);
    return !!result.isStreamer;
}


export const logout = async () => {
    await chrome.storage.local.set({
        loginToken: '',
        isStreamer: false,
        loggedIn: false,
    });
}
// #endregion module
