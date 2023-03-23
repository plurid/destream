// #region module
export const getSession = async (
    tabID: number,
) => {
    try {
        const id = `tab-settings-${tabID}`;
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
