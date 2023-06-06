// #region imports
    // #region libraries
    import { ApolloServer } from '@apollo/server';
    import { startStandaloneServer } from '@apollo/server/standalone';
    // #endregion libraries


    // #region internal
    import {
        port,
    } from './data';

    import {
        typeDefs,
        resolvers,
    } from './graphql';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const {
        url,
    } = await startStandaloneServer(server, {
        listen: {
            port,
        },
    });

    console.log(`\n\tDestream Server Started at ${url}\n`);
}

main();
// #endregion module
