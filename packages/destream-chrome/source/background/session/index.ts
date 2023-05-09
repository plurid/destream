// #region imports
    // #region external
    import {
        Session,
        storagePrefix,
    } from '../../data';

    import {
        storageGet,
        storageSet,
        storageRemove,
    } from '../../common/storage';
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
// #endregion module
