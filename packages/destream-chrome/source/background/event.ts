// #region imports
    // #region libraries
    import {
        Subject,
    } from 'rxjs';
    // #endregion libraries


    // #region external
    import {
        DESTREAM_EVENT,
        DestreamEvent,
    } from '../data';
    // #endregion external


    // #region internal
    import {
        openTab,
    } from './utilities';

    import messager from './messager';
    // #endregion internal
// #endregion imports



// #region module
// class ConnectionManager {
//     private subscriptions: Record<string, any> = {};

//     public listen() {
//         const subscriptionListener = (
//             changes: {
//                 [key: string]: chrome.storage.StorageChange;
//             },
//         ) => {
//             for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//                 if (key === 'subscriptions') {
//                     for (const subscription of newValue) {
//                         if (!this.subscriptions[subscription]) {
//                             this.subscriptions[subscription] = 'subscription';
//                         }
//                     }
//                 }
//             }
//         }

//         chrome.storage.onChanged.addListener(subscriptionListener);
//     }
// }

// const connectionManager = new ConnectionManager();
// connectionManager.listen();


export const sendEventToPage = async (
    tabID: number,
    event: DestreamEvent,
) => {
    try {
        const response = await chrome.tabs.sendMessage(
            tabID,
            {
                type: DESTREAM_EVENT,
                data: event,
            },
        );
        console.log('response', response);
    } catch (error) {
        console.log(error);
    }
}


const composeTopicID = () => {
    const topicID = 'destream';

    return topicID;
}


export const publishEvent = (
    data: DestreamEvent,
    // messager,
) => {
    try {
        const topicID = composeTopicID();

        messager.publish(
            topicID,
            data,
        );
    } catch (error) {
        console.log(error);
    }
}


export const streamPlayer = async (
    url: string,
    stream: Subject<DestreamEvent>,
) => {
    const tab = await openTab(url);

    stream.subscribe(event => {
        sendEventToPage(tab.id, event);
    });
}


export const delay = async (
    milliseconds: number,
) => {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}


export const run = async () => {
    const sessionURL = 'https://pastebin.com/raw/hADNsQi8';
    const sesssionData = JSON.parse(
        await ((await fetch(sessionURL)).text()),
    );

    const eventStream = new Subject<DestreamEvent>();

    await streamPlayer(
        sesssionData.url,
        eventStream,
    );

    const topicID = composeTopicID();

    messager.subscribe<{data: DestreamEvent}>(
        topicID,
        (message) => {
            console.log('destream message', message);
            eventStream.next(message.data);
        },
    );

    await delay(2_000);

    for (const event of sesssionData.events) {
        eventStream.next(event.data);

        await delay(event.relativeTime);
    }
}
// #endregion module
