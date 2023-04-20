// #region imports
    // #region external
    import {
        IN_PRODUCTION,
    } from '../../data/constants';
    // #endregion external
// #endregion imports



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


export const log = (
    message: any,
) => {
    if (IN_PRODUCTION) {
        return;
    }

    console.log('log', message);
}
// #endregion module
