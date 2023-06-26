// #region imports
    // #region external
    import {
        storagePrefix,
    } from '~data/constants';

    import {
        storageSetMultiple,
    } from '../storage';

    import {
        getTab,
    } from '../tab';
    // #endregion external
// #endregion imports



// #region module
export const getActiveTab = async () => {
    return await getTab();
}


export const login = async (
    identonym: string,
    tokens: any,
    destream: any,
) => {
    await storageSetMultiple({
        identonym,
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        isStreamer: destream.isStreamer,
        loggedIn: true,
    });
}


export const logout = async () => {
    await storageSetMultiple({
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
        || key.startsWith(storagePrefix.linkage)
        || key.startsWith(storagePrefix.tabSettings);
}
// #endregion module
