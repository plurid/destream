// #region imports
    // #region external
    import {
        TabSettings,
        GeneralPermissions,
    } from '~data/interfaces';

    import {
        DEFAULT_API_ENDPOINT,
        storagePrefix,
        storageFields,
        destreamCurrentStateTopicSuffix,
    } from '~data/constants';

    import {
        storageGet,
        storageRemove,
        storageGetTokens,
    } from '~common/storage';

    import {
        Tab,
        Window,
    } from '~common/types';

    import {
        getTab as commonGetTab,
        tabsCreate,
        tabsGroup,
        tabGroupsQuery,
        tabGroupsUpdate,
        windowsGetAll,
        windowsCreate,
    } from '~common/tab';

    import {
        generateClient,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
export const noOp = () => {};


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
    groupTitle: string,
    generalPermissions: GeneralPermissions,
) => {
    if (!generalPermissions.useSessionGroups) {
        return;
    }

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



export const getGeneralPermissions = async () => {
    const generalPermissions = await storageGet<GeneralPermissions>(
        storageFields.generalPermissions,
    );

    return generalPermissions;
}



/**
 * From https://stackoverflow.com/a/52171480
 *
 * @param str
 * @param seed
 * @returns
 */
const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const hashValue = (
    value: string,
) => {
    return cyrb53(value);
}
// #endregion module
