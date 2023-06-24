// #region module
/**
 * Get tab by `id` or get the active tab.
 *
 * @param id
 * @returns
 */
export const getTab = async (
    id?: number,
) => {
    if (typeof id === 'number') {
        const tab = await chrome.tabs.get(id);
        return tab;
    }

    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    return tab;
}


export const tabsOnRemovedAddListener = (
    listener: (
        tabId: number,
    ) => void,
) => {
    chrome.tabs.onRemoved.addListener(listener);
}

export const tabsOnUpdatedAddListener = (
    listener: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        _tab: chrome.tabs.Tab,
    ) => void,
) => {
    chrome.tabs.onUpdated.addListener(listener);
}


export const tabsUngroup = async (
    tabID: number,
) => {
    return await chrome.tabs.ungroup(tabID);
}


export const tabsUpdate = (
    tabID: number,
    updateProperties: chrome.tabs.UpdateProperties,
) => {
    chrome.tabs.update(
        tabID,
        {
            ...updateProperties,
        },
    );
}

export const tabsCreate = async (
    createProperties: chrome.tabs.CreateProperties,
) => {
    return await chrome.tabs.create({
        ...createProperties,
    });
}


export const tabsGroup = async (
    groupOptions: chrome.tabs.GroupOptions,
) => {
    const groupID = await chrome.tabs.group({
        ...groupOptions,
    });

    return groupID;
}


export const tabGroupsQuery = async (
    queryInfo: chrome.tabGroups.QueryInfo,
) => {
    return await chrome.tabGroups.query({
        ...queryInfo,
    });
}

export const tabGroupsUpdate = async (
    groupID: number,
    updateProperties: chrome.tabGroups.UpdateProperties,
) => {
    await chrome.tabGroups.update(groupID, {
        ...updateProperties,
    });
}



export const windowsGetAll = async () => {
    return await chrome.windows.getAll();
}

export const windowsCreate = async (
    createData: chrome.windows.CreateData,
) => {
    return await chrome.windows.create({
        ...createData,
    });
}
// #endregion module
