// #region imports
    // #region external
    import {
        Replayment,
        storagePrefix,
    } from '../../data';

    import {
        storageGet,
        storageSet,
        storageRemove,
        storageGetAll,
    } from '../../common/storage';
    // #endregion external
// #endregion imports



// #region module
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
// #endregion module
