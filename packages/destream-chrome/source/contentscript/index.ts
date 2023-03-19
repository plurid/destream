// #region imports
    // #region internal
    import {
        runViewer,
    } from './viewer';

    import {
        runStreamer,
    } from './streamer';

    import {
        injectView,
    } from './view';
    // #endregion internal
// #endregion imports



// #region module
export const getTabID = async (): Promise<number | undefined> => {
    const response = await chrome.runtime.sendMessage({
        type: 'getTabID',
    });
    if (!response) {
        return;
    }

    return response.tabID;
}

export const getSession = async (
    tabID: number | undefined,
) => {
    if (!tabID) {
        return;
    }

    const response = await chrome.runtime.sendMessage({
        type: 'getSession',
        tabID,
    });
    if (!response) {
        return;
    }

    return true;
}


const main = async () => {
    runViewer();
    runStreamer();

    const tabID = await getTabID();
    const session = await getSession(tabID);

    if (session) {
        // check if there is an active session
        // inject view if active
        // injectView();
    }
}

main();
// #endregion module
