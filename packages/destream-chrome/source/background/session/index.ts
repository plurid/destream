// #region imports
    // #region external
    import {
        Session,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
export const composeTopicID = (
    id: string,
) => {
    const topicID = 'destream-' + id;

    return topicID;
}


export const getSessionStorageID = (
    tabID: number,
) => {
    return `session-${tabID}`;
}


export const startSession = async (
    tabID: number,
    sessionID: string,
    streamer: string,
    token: string,
) => {
    try {
        const id = getSessionStorageID(tabID);
        const session: Session = {
            id: sessionID,
            tabID,
            startedAt: Date.now(),
            streamer,
            token,
        };

        await chrome.storage.local.set({
            [id]: session,
        });
    } catch (error) {
        return;
    }
}


export const deleteSession = async (
    tabID: number,
) => {
    const id = getSessionStorageID(tabID);
    await chrome.storage.local.remove(id);
}


export const getSession = async (
    tabID: number,
): Promise<Session | undefined> => {
    try {
        const id = getSessionStorageID(tabID);
        const result = await chrome.storage.local.get([id]);
        return result[id];
    } catch (error) {
        return;
    }
}
// #endregion module
