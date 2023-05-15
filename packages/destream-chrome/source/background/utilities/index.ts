// #region imports
    // #region external
    import {
        storagePrefix,
        destreamTopicSuffix,
    } from '../../data/constants';

    import {
        TabSettings,
    } from '../../data/interfaces';

    import {
        storageGet,
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

export const getTabSettings = async (
    id: number,
): Promise<TabSettings | undefined> => {
    const tabSettings = await storageGet(
        getTabSettingsID(id),
    );

    return tabSettings;
}

export const removeTabSettings = async (
    id: number,
) => {
    const tabSettingsID = getTabSettingsID(id);

    await storageRemove(tabSettingsID);
}


export const getPublishTopicID = (
    id: string,
) => {
    return storagePrefix.destreamTopic + id;
}

export const getJoinTopicID = (
    id: string,
) => {
    return storagePrefix.destreamTopic + id + destreamTopicSuffix;
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
