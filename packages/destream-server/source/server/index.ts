// #region imports
    // #region libraries
    import http from 'node:http';

    import { ApolloServer } from '@apollo/server';
    import { expressMiddleware } from '@apollo/server/express4';
    import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

    import express from 'express';
    import bodyParser from 'body-parser';
    import cors, {
        CorsOptions,
    } from 'cors';
    // #endregion libraries


    // #region external
    import {
        port,
    } from '../data';

    import {
        typeDefs,
        resolvers,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
export const startServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    });

    await server.start();

    const corsOptions: CorsOptions = {
        credentials: true,
        origin: (_: any, callback: any) => {
            return callback(null, true);
        },
    }

    app.options('*', cors(corsOptions));

    app.use(
        '*',
        cors(corsOptions),
        bodyParser.json(),
        expressMiddleware(server),
    );

    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

    return port;
}
// #endregion module
