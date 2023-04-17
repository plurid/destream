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
        Session,
    } from '../../data';

    import {
        openTab,
    } from '../utilities';

    import messagerManager from '../messager';
    // #endregion external
// #endregion imports



// #region module
export const sendEventToPage = async (
    tabID: number,
    event: DestreamEvent,
) => {
    try {
        const response = await chrome.tabs.sendMessage<DestreamEventMessage>(
            tabID,
            {
                type: MESSAGE_TYPE.DESTREAM_EVENT,
                data: event,
            },
        );
        console.log('response', response);
    } catch (error) {
        console.log(error);
    }
}


export const composeTopicID = (
    id: string,
) => {
    const topicID = 'destream-' + id;

    return topicID;
}


export const publishEvent = (
    session: Session,
    data: DestreamEvent,
    // messager,
) => {
    try {
        const {
            id,
            token,
        } = session;

        const topicID = composeTopicID(id);

        // messagerManager.get().publish(
        //     token,
        //     topicID,
        //     data,
        // );
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

    const topicID = composeTopicID('');

    messagerManager.get().subscribe<{data: DestreamEvent}>(
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
