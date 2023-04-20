// #region imports
    // #region libraries
    import {
        Subject,
    } from 'rxjs';
    // #endregion libraries


    // #region external
    import {
        DestreamEvent,
        Session,
    } from '../../data';

    import {
        streamPlayer,
    } from '../event';

    import messagerManager from '../messager';
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


export class SessionPlayer {
    public async sendMessage(
        tabID: number,
        event: any,
    ) {
        await chrome.tabs.sendMessage(
            tabID,
            {
                event,
            },
        );
    }
}



export class SessionManager {
    private eventStreams = new Map<string, Subject<DestreamEvent>>();


    constructor() {

    }


    public async new(
        url: string,
    ) {
        const eventStream = new Subject<DestreamEvent>();

        await streamPlayer(
            url,
            eventStream,
        );

        const topicID = composeTopicID('');

        messagerManager.get().subscribe<{data: DestreamEvent}>(
            topicID,
            (message) => {
                console.log('destream message', message);
                eventStream.next(message.data);
            },
        );

        this.eventStreams.set(topicID, eventStream);
    }

    public stop(
        id: string,
    ) {
        this.eventStreams.get(id)?.complete();
        this.eventStreams.delete(id);
    }
}


export const sessionManager = new SessionManager();
// #endregion module
