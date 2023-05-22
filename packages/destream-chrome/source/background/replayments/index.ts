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
    } from '../../common/storage';
    // #endregion external
// #endregion imports



// #region module
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

    return true;
}


export const stopReplaymentWithTabID = async (
    tabID: number,
) => {
    await storageRemove(storagePrefix.replayment + tabID);
}
// #endregion module
