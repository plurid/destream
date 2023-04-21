// #region imports
    // #region external
    import {
        storagePrefix,
    } from '../../data/constants';

    import {
        storageRemove,
    } from '../../common/storage';
    // #endregion external
// #endregion imports



// #region module
export const getTabSettingsID = (
    id: number,
) => {
    return storagePrefix.tabSettings + id;
}

export const removeTabSettings = async (
    id: number,
) => {
    const tabSettingsID = getTabSettingsID(id);

    await storageRemove(tabSettingsID);
}


export const getTopicID = (
    id: string,
) => {
    return storagePrefix.destreamTopic + id;
}


export const openTab = async (
    url: string,
    active = false,
) => {
    return await chrome.tabs.create({
        url,
        active,
    });
}
// #endregion module
