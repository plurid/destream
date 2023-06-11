// #region imports
    // #region external
    import {
        storagePrefix,
        destreamCurrentStateTopicSuffix,
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

export const getCurrentStateTopicID = (
    id: string,
) => {
    return storagePrefix.destreamTopic + id + destreamCurrentStateTopicSuffix;
}

export const getCurrentStateArbitraryTopicID = (
    currentStateTopic: string,
) => {
    const randomID = Array(10)
        .fill('')
        .reduce<string[]>((value) => [...value, Math.random().toString(36).substring(2)], [])
        .join('');

    return currentStateTopic + '/' + randomID;
}


export const openTab = async (
    url: string,
    active = false,
    incognito?: boolean,
) => {
    let incognitoWindow: chrome.windows.Window | undefined;
    if (incognito) {
        const windows = await chrome.windows.getAll();
        const incognitoWindows = windows.filter(window => window.incognito);
        // check if/which incognito windows have a group or session tabs already
        const existingIncognitoWindow = incognitoWindows[0];

        if (existingIncognitoWindow) {
            incognitoWindow = existingIncognitoWindow;
        } else {
            incognitoWindow = await chrome.windows.create({
                incognito: true,
            });
        }
    }

    return await chrome.tabs.create({
        url,
        active,
        windowId: incognitoWindow?.id,
    });
}

export const getTab = async (
    id: number,
): Promise<chrome.tabs.Tab | undefined> => {
    return await chrome.tabs.get(id);
}


export const assignTabToGroup = async (
    tab: chrome.tabs.Tab,
    streamerIdentonym: string,
    generalPermissions: GeneralPermissions,
) => {
    if (!generalPermissions.useSessionGroups) {
        return;
    }

    const groupTitle = streamerIdentonym + TAB_GROUP_SUFFIX;

    const groups = await chrome.tabGroups.query({
        title: groupTitle,
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
        title: groupTitle,
    });
}
// #endregion module
