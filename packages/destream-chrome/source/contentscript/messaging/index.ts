// #region imports
    // #region external
    import {
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
    } from '~data/constants';

    import {
        MessageGetTabID,
        ResponseGetTabID,
        MessageGetSession,
        ResponseGetSession,
        MessageGetSubscription,
        ResponseGetSubscription,
        MessageGetTabSettings,
        ResponseGetTabSettings,
        Session,
        Subscription,
        TabSettings,
    } from '~data/interfaces';

    import {
        sendMessage,
    } from '~common/messaging';
    // #endregion external
// #endregion imports



// #region module
export const getTabID = async (): Promise<number | undefined> => {
    const response = await sendMessage<MessageGetTabID, ResponseGetTabID>({
        type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_TAB_ID,
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

    const response = await sendMessage<MessageGetSession, ResponseGetSession>({
        type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SESSION,
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

    const response = await sendMessage<MessageGetSubscription, ResponseGetSubscription>({
        type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SUBSCRIPTION,
        data: tabID,
    });
    if (!response || !response.status) {
        return;
    }

    return response.subscription;
}


export const getTabSettings = async (
    tabID: number | undefined,
): Promise<TabSettings | undefined> => {
    if (!tabID) {
        return;
    }

    const response = await sendMessage<MessageGetTabSettings, ResponseGetTabSettings>({
        type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_TAB_SETTINGS,
        data: tabID,
    });
    if (!response || !response.status) {
        return;
    }

    return response.tabSettings;
}
// #endregion module
