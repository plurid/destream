// #region imports
    // #region external
    import {
        destreamGetMessagerData,
    } from '../resolver';
    // #endregion external
// #endregion imports



// #region module
export const typeDefs = `#graphql
    type Query {
        destreamGetMessagerData: ResponseDestreamMessagerData!
    }

    type ResponseDestreamMessagerData {
        status: Boolean!
        errors: [Error!]
        data: String
    }

    type Error {
        type: String!
        path: String!
        message: String!
    }
`;


export const resolvers = {
    Query: {
        destreamGetMessagerData,
    },
};
// #endregion module
