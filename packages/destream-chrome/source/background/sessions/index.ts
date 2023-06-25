// #region imports
    // #region external
    import {
        Session,
        MessageStartAnotherSession,
        RequestURLChange,

        storagePrefix,
        DEFAULT_API_ENDPOINT,
        GENERAL_EVENT,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';

    import {
        storageGet,
        storageGetAll,
        storageSet,
        storageRemove,
        storageGetTokens,
    } from '../../common/storage';

    import {
        log,
    } from '../../common/utilities';

    import {
        Tab,
        TabChangeInfo,
    } from '../../common/types';

    import {
        generateClient,
        STOP_SESSION,
        GET_SESSION_AUDIENCE,
        RECORD_SESSION_EVENT,
    } from '../graphql';

    import {
        removeTabSettings,
        getDefaultGraphqlClient,
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
    publishTopic: string,
    currentStateTopic: string,
    token: string,
    endpoint: string,
) => {
    const id = getSessionStorageID(tabID);
    const session: Session = {
        id: sessionID,
        tabID,
        startedAt: Date.now(),
        streamer,
        publishTopic,
        currentStateTopic,
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


export const getSessions = async () => {
    try {
        const storage = await storageGetAll();
        const sessions = Object
            .keys(storage)
            .filter(item => item.startsWith(storagePrefix.session))
            .map(id => storage[id]);

        return sessions as Session[];
    } catch (error) {
        return [];
    }
}


export const getSessionAudience = async (
    sessionID: string,
) => {
    const graphqlClient = await getDefaultGraphqlClient();

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


export const composeEventData = <E = any>(
    session: Session,
    eventData: E,
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
    changeInfo: TabChangeInfo,
    _tab: Tab,
) => {
    try {
        if (!changeInfo.url) {
            return;
        }

        const session = await getSession(tabID);
        if (!session) {
            return;
        }

        await sendMessageToTab<RequestURLChange>(session.tabID, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.URL_CHANGE,
            session,
            url: changeInfo.url,
        });

        const graphqlClient = await getDefaultGraphqlClient();

        const event = composeEventData(session, {
            type: GENERAL_EVENT.URL_CHANGE,
            payload: {
                url: changeInfo.url,
            },
        });

        const graphqlRequest = await graphqlClient.mutate({
            mutation: RECORD_SESSION_EVENT,
            variables: {
                input: event,
            },
        });
        const response = graphqlRequest.data.destreamRecordSessionEvent;
        if (!response.status) {
            log(response.error);
            return;
        }
    } catch (error) {
        log(error);
    }
}


export const notifyStartAnotherSession = async (
    newSessionID: string,
) => {
    const sessions = await getSessions();
    if (sessions.length === 0) {
        return;
    }

    const session = sessions[0];

    await sendMessageToTab<MessageStartAnotherSession>(session.tabID, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.START_ANOTHER_SESSION,
        data: {
            session,
            newSessionID,
        },
    });
}
// #endregion module
