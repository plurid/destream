// #region imports
    // #region external
    import {
        storagePrefix,
    } from '../../data/constants';
    // #endregion external
// #endregion imports



// #region module
export const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    return tab;
}


export const login = async (
    identonym: string,
    tokens: any,
    destream: any,
) => {
    await chrome.storage.local.set({
        identonym,
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        isStreamer: destream.isStreamer,
        loggedIn: true,
    });
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


export const checkEverythingKey = (
    key: string,
) => {
    return key.startsWith(storagePrefix.session)
        || key.startsWith(storagePrefix.subscription)
        || key.startsWith(storagePrefix.replayment)
        || key.startsWith(storagePrefix.tabSettings);
}
// #endregion module
