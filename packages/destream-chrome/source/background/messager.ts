// #region imports
    // #region libraries
    import Messager from '@plurid/messager';
    // #endregion libraries


    // #region external
    import {
        DEFAULT_MESSAGER_ENDPOINT,
        DEFAULT_MESSAGER_TOKEN,
    } from '../data/constants';
    // #endregion external
// #endregion imports



// #region module
const messager = new Messager(
    DEFAULT_MESSAGER_ENDPOINT,
    DEFAULT_MESSAGER_TOKEN,
    'socket',
    {
        log: true,
        secure: false,
    },
);
// #endregion module



// #region exports
export default messager;
// #endregion exports
