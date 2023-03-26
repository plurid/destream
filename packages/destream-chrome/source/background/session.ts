// #region module
export const getSessionStorageID = (
    tabID: number,
) => {
    return `session-${tabID}`;
}


export const startSession = async (
    tabID: number,
) => {
    try {
        const id = getSessionStorageID(tabID);
        const storage: any = {};
        storage[id] = {
            tabID,
        };
        await chrome.storage.local.set(storage);
    } catch (error) {
        return;
    }
}


export const deleteSession = async (
    tabID: number,
) => {
    const id = getSessionStorageID(tabID);
    await chrome.storage.local.remove(id);
}


export const getSession = async (
    tabID: number,
) => {
    try {
        const id = getSessionStorageID(tabID);
        const result = await chrome.storage.local.get([id]);
        return result[id];
    } catch (error) {
        return;
    }
}


export class SessionPlayer {
    public async sendMessage(
        tabID: number,
        event: any,
    ) {
        await chrome.tabs.sendMessage(
            tabID,
            {
                event,
            },
        );
    }
}
// #endregion module
