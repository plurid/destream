// #region imports
    // #region libraries
    import {
        Subject,
    } from 'rxjs';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_TYPE,
        DestreamEvent,
        DestreamEventMessage,
    } from '../data';
    // #endregion external


    // #region internal
    import {
        streamPlayer,
        composeTopicID,
    } from './event';

    import messagerManager from './messager';
    // #endregion internal
// #endregion imports



// #region module
export const getSessionStorageID = (
    tabID: number,
) => {
    return `session-${tabID}`;
}


export const startSession = async (
    tabID: number,
) => {
    try {
        const id = getSessionStorageID(tabID);
        const storage: any = {};
        storage[id] = {
            tabID,
        };
        await chrome.storage.local.set(storage);
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
) => {
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

        const topicID = composeTopicID();

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
