// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
    } from '../../data/constants';

    import {
        GetTabIDMessage,
        GetSessionMessage,
    } from '../../data/interfaces';
    // #endregion external
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
// #endregion module
