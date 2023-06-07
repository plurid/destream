// #region imports
    // #region internal
    import {
        startServer,
    } from './server';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    const port = await startServer();

    console.log(`\n\tDestream Server Started on localhost:${port}\n`);
}

main();
// #endregion module
