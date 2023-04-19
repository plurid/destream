// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
    } from '../data/constants';

    import {
        GetTabIDMessage,
        GetSessionMessage,
    } from '../data/interfaces';
    // #endregion external


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
    const response = await chrome.runtime.sendMessage<GetTabIDMessage>({
        type: MESSAGE_TYPE.GET_TAB_ID,
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

    const response = await chrome.runtime.sendMessage<GetSessionMessage>({
        type: MESSAGE_TYPE.GET_SESSION,
        data: tabID,
    });
    if (!response) {
        return;
    }

    return true;
}


const main = async () => {
    try {
        const chromeRuntimePort = chrome.runtime.connect();

        const viewerCleanup = await runViewer();
        const streamerCleanup = await runStreamer();

        const tabID = await getTabID();
        const session = await getSession(tabID);

        if (session) {
            // check if there is an active session
            // inject view if active
            // injectView();
        }

        chromeRuntimePort.onDisconnect.addListener(() => {
            viewerCleanup();
            streamerCleanup();
        });
    } catch (error) {
        console.log(error);
    }
}

main();
// #endregion module
