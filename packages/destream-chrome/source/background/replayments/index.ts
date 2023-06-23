// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        DEFAULT_API_ENDPOINT,
        storagePrefix,
        Replayment,
        ReplaySessionMessage,
    } from '../../data';

    import {
        storageGet,
        storageGetTokens,
        storageSet,
        storageRemove,
        storageGetAll,
    } from '../../common/storage';

    import {
        sendMessage,
    } from '../../common/messaging';

    import {
        log,
        destreamIDGetValue,
    } from '../../common/utilities';

    import {
        generateClient,
        GET_SESSION,
    } from '../../background/graphql';


    import handleReplaySession from '../handlers/handleReplaySession';
    // #endregion external
// #endregion imports



// #region module
export const getReplaymentStorageID = (
    tabID: number,
) => {
    return storagePrefix.replayment + tabID;
}


export const getReplayments = async () => {
    try {
        const storage = await storageGetAll();
        const replayments = Object
            .keys(storage)
            .filter(item => item.startsWith(storagePrefix.replayment))
            .map(id => storage[id]);

        return replayments as Replayment[];
    } catch (error) {
        return [];
    }
}


export const getReplaymentByTabID = async (
    tabID: number,
): Promise<Replayment | undefined> => {
    const replayments = await getReplayments();
    const replayment = replayments.find(replayment => replayment.tabID === tabID);

    return replayment;
}


export const updateReplayment = async (
    tabID: number,
    data: any,
) => {
    const replaymentID = storagePrefix.replayment + tabID;
    const replayment = await storageGet<Replayment>(replaymentID);
    if (!replayment) {
        return false;
    }

    await storageSet(
        replaymentID,
        {
            ...replayment,
            ...data,
        },
    );

    return replayment;
}


export const stopReplaymentWithTabID = async (
    tabID: number,
) => {
    await storageRemove(storagePrefix.replayment + tabID);
}


export const replaymentAtEnd = (
    replayment: Replayment,
    index?: number,
) => {
    const eventsLength = replayment.data.events.length - 1;

    if (typeof index === 'number') {
        return eventsLength === index;
    }

    return eventsLength === replayment.currentIndex;
}


export const initializeReplayment = async (
    destreamID: string,
    callback?: () => void,
    backgroundOnly = false,
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

    const destreamIDValue = destreamIDGetValue(destreamID);

    const request = await graphqlClient.query({
        query: GET_SESSION,
        variables: {
            input: {
                value: destreamIDValue,
            },
        },
    });

    const response = request.data.destreamGetSession;
    if (!response.status) {
        return;
    }

    const {
        data,
    } = response;


    if (backgroundOnly) {
        await handleReplaySession(
            {
                type: MESSAGE_TYPE.REPLAY_SESSION,
                data,
            },
            {},
            () => {},
        ).catch(log);
    } else {
        await sendMessage<ReplaySessionMessage>(
            {
                type: MESSAGE_TYPE.REPLAY_SESSION,
                data,
            },
            () => {
                if (callback) {
                    callback();
                }
            },
        ).catch(log);
    }
}
// #endregion module
