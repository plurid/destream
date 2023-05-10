// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
    } from '../../data/constants';

    import {
        GetTabIDMessage,
        GetSessionMessage,
        GetSubscriptionMessage,
        Session,
        Subscription,
    } from '../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const getTabID = async (): Promise<number | undefined> => {
    const response = await chrome.runtime.sendMessage<GetTabIDMessage>({
        type: MESSAGE_TYPE.GET_TAB_ID,
    });
    if (!response || !response.status) {
        return;
    }

    return response.tabID;
}


export const getSession = async (
    tabID: number | undefined,
): Promise<Session | undefined> => {
    if (!tabID) {
        return;
    }

    const response = await chrome.runtime.sendMessage<GetSessionMessage>({
        type: MESSAGE_TYPE.GET_SESSION,
        data: tabID,
    });
    if (!response || !response.status) {
        return;
    }

    return response.session;
}


export const getSubscription = async (
    tabID: number | undefined,
): Promise<Subscription | undefined> => {
    if (!tabID) {
        return;
    }

    const response = await chrome.runtime.sendMessage<GetSubscriptionMessage>({
        type: MESSAGE_TYPE.GET_SUBSCRIPTION,
        data: tabID,
    });
    if (!response || !response.status) {
        return;
    }

    return response.subscription;
}
// #endregion module
