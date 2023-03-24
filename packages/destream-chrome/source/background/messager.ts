// #region imports
    // #region libraries
    import Messager from '@plurid/messager';
    // #endregion libraries
// #endregion imports



// #region module
const endpoint = 'localhost:56865';
const token = '__TEST_MODE__';

const messager = new Messager(
    endpoint,
    token,
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
