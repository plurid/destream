// #region imports
    // #region external
    import {
        storagePrefix,
        destreamTopicSuffix,
        TAB_GROUP_SUFFIX,
    } from '../../data/constants';

    import {
        TabSettings,
        GeneralPermissions,
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


export const assignTabToGroup = async (
    tab: chrome.tabs.Tab,
    streamerIdentonym: string,
    generalPermissions: GeneralPermissions,
) => {
    if (!generalPermissions.useSessionGroups) {
        return;
    }

    const groups = await chrome.tabGroups.query({
        title: streamerIdentonym,
    });
    const existingGroup = groups[0];

    if (existingGroup) {
        await chrome.tabs.group({
            groupId: existingGroup.id,
            tabIds: tab.id,
        });
        return;
    }

    const groupID = await chrome.tabs.group({
        tabIds: tab.id,
    });

    await chrome.tabGroups.update(groupID, {
        title: streamerIdentonym + TAB_GROUP_SUFFIX,
    });
}
// #endregion module
