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
        composeTopicID,
    } from '../event';

    import messagerManager from '../messager';
    // #endregion external
// #endregion imports



// #region module
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



const orderIndexBase = 'orderIndex-';

export class SessionOrderIndex {
    private indices: Record<string, number> = {};


    constructor() {
        this.load();
    }


    private async load() {
        const storage: any = await chrome.storage.local.get(null);
        const indicesIDs = Object
            .keys(storage)
            .filter(item => item.startsWith(orderIndexBase));

        for (const index of indicesIDs) {
            const indexStore = orderIndexBase.replace(orderIndexBase, '');
            const query = await chrome.storage.local.get(index);
            this.indices[indexStore] = query[index];
        }
    }

    private async update() {
        let values: Record<string, number> = {};

        for (const [id, value] of Object.entries(this.indices)) {
            values[orderIndexBase + id] = value;
        }

        await chrome.storage.local.set(values);
    }


    public get(
        session: string,
    ) {
        const value = this.indices[session];

        if (typeof value === 'number') {
            this.indices[session] += 1;
            this.update();
            return value;
        }

        this.indices[session] = 0;
        this.update();
        return 0;
    }
}

export const sessionOrderIndex = new SessionOrderIndex();
// #endregion module
