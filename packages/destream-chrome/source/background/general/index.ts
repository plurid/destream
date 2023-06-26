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

export const initialize = () => {
    initializeGeneralPermissions();
}
// #endregion module
