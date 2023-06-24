// #region imports
    // #region external
    import {
        DEFAULT_API_ENDPOINT,
        TAB_GROUP_SUFFIX,
        storagePrefix,
        destreamCurrentStateTopicSuffix,
    } from '../../data/constants';

    import {
        TabSettings,
        GeneralPermissions,
    } from '../../data/interfaces';

    import {
        storageGet,
        storageRemove,
        storageGetTokens,
    } from '../../common/storage';

    import {
        Tab,
        Window,
    } from '../../common/types';

    import {
        getTab as commonGetTab,
        tabsCreate,
        tabsGroup,
        tabGroupsQuery,
        tabGroupsUpdate,
        windowsGetAll,
        windowsCreate,
    } from '../../common/tab';

    import {
        generateClient,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
export const getDefaultGraphqlClient = async () => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    return graphqlClient;
}



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
    let incognitoWindow: Window | undefined;
    if (incognito) {
        const windows = await windowsGetAll();
        const incognitoWindows = windows.filter(window => window.incognito);
        // check if/which incognito windows have a group or session tabs already
        const existingIncognitoWindow = incognitoWindows[0];

        if (existingIncognitoWindow) {
            incognitoWindow = existingIncognitoWindow;
        } else {
            incognitoWindow = await windowsCreate({
                incognito: true,
            });
        }
    }

    return await tabsCreate({
        url,
        active,
        windowId: incognitoWindow?.id,
    });
}

export const getTab = async (
    id: number,
): Promise<Tab | undefined> => {
    return await commonGetTab(id);
}


export const assignTabToGroup = async (
    tab: Tab,
    streamerIdentonym: string,
    generalPermissions: GeneralPermissions,
) => {
    if (!generalPermissions.useSessionGroups) {
        return;
    }

    const groupTitle = streamerIdentonym + TAB_GROUP_SUFFIX;

    const groups = await tabGroupsQuery({
        title: groupTitle,
    });
    const existingGroup = groups[0];

    if (existingGroup) {
        await tabsGroup({
            groupId: existingGroup.id,
            tabIds: tab.id,
        });
        return;
    }

    const groupID = await tabsGroup({
        tabIds: tab.id,
    });

    await tabGroupsUpdate(groupID, {
        title: groupTitle,
    });
}
// #endregion module
