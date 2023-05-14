// #region imports
    // #region external
    import {
        Session,
        storagePrefix,
        DEFAULT_API_ENDPOINT,
        GENERAL_EVENT,
    } from '../../data';

    import {
        storageGet,
        storageSet,
        storageRemove,
        storageGetTokens,
    } from '../../common/storage';

    import {
        generateClient,
        STOP_SESSION,
        GET_SESSION_AUDIENCE,
    } from '../graphql';

    import {
        removeTabSettings,
        getTopicID,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export const getSessionStorageID = (
    tabID: number,
) => {
    return storagePrefix.session + tabID;
}


export const startSession = async (
    tabID: number,
    sessionID: string,
    streamer: string,
    token: string,
    endpoint: string,
) => {
    const id = getSessionStorageID(tabID);
    const session: Session = {
        id: sessionID,
        tabID,
        startedAt: Date.now(),
        streamer,
        token,
        endpoint,
    };

    await storageSet(id, session);
}


export const deleteSession = async (
    tabID: number,
) => {
    const id = getSessionStorageID(tabID);
    await storageRemove(id);
}


export const getSession = async (
    tabID: number,
): Promise<Session | undefined> => {
    const id = getSessionStorageID(tabID);
    return await storageGet<Session>(id);
}


export const getSessionAudience = async (
    sessionID: string,
) => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const graphqlRequest = await graphqlClient.mutate({
        mutation: GET_SESSION_AUDIENCE,
        variables: {
            input: {
                value: sessionID,
            },
        },
    });
    const response = graphqlRequest.data.destreamGetSessionAudience;

    return response;
}


export const stopSessionLogic = async (
    sessionID: string,
    tabID: number,
) => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const graphqlRequest = await graphqlClient.mutate({
        mutation: STOP_SESSION,
        variables: {
            input: {
                value: sessionID,
            },
        },
    });
    const response = graphqlRequest.data.destreamStopSession;

    if (response.status) {
        await deleteSession(tabID);
        await removeTabSettings(tabID);
    }

    return response;
}


export const stopSessionWithTabID = async (
    tabID: number,
) => {
    const session = await getSession(tabID);
    if (!session) {
        return;
    }

    await stopSessionLogic(
        session.id,
        tabID,
    );
}


export const composeEventData = (
    session: Session,
    eventData: any,
) => {
    const relativeTime = Date.now() - session.startedAt;
    const data = JSON.stringify(eventData);

    const event = {
        sessionID: session.id,
        relativeTime,
        data,
    };

    return event;
}


export const updateSession = async (
    tabID: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    _tab: chrome.tabs.Tab,
) => {
    if (!changeInfo.url) {
        return;
    }

    const session = await getSession(tabID);
    if (!session) {
        return;
    }

    await chrome.tabs.sendMessage(session.tabID, {
        type: GENERAL_EVENT.URL_CHANGE,
        topic: getTopicID(session.id),
        session,
        url: changeInfo.url,
    });
}
// #endregion module
