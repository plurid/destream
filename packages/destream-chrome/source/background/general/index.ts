// #region imports
    // #region external
    import {
        GeneralPermissions,
    } from '~data/interfaces';

    import {
        storageFields,
        defaultPermissions,
    } from '~data/constants';

    import {
        storageGet,
        storageSet,
    } from '~common/storage';


    import {
        stopSessionWithTabID,
    } from '../sessions';

    import {
        stopSubscriptionWithTabID,
    } from '../subscriptions';

    import {
        stopReplaymentWithTabID,
    } from '../replayments';

    import {
        stopLinkageWithTabID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
export const initializeGeneralPermissions = async () => {
    const generalPermissions = await storageGet<GeneralPermissions>(storageFields.generalPermissions);
    if (generalPermissions) {
        return;
    }

    await storageSet(
        storageFields.generalPermissions,
        defaultPermissions,
    );
}

export const initialize = async () => {
    await initializeGeneralPermissions();
}



export const onTabRemovedListeners = [
    stopSessionWithTabID,
    stopSubscriptionWithTabID,
    stopReplaymentWithTabID,
    stopLinkageWithTabID,
];
// #endregion module
