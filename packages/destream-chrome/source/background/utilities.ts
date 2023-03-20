// #region module
export const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    return tab;
}


export const openTab = async (
    url: string,
) => {
    return await chrome.tabs.create({
        url,
        // active: false,
    });
}
// #endregion module
