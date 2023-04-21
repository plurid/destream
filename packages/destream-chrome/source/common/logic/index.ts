// #region module
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
