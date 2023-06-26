// #region imports
    // #region libraries
    import {
        ApolloClient,
        createHttpLink,
        InMemoryCache,
    } from '@apollo/client';
    // #endregion libraries


    // #region external
    import {
        DEFAULT_API_ENDPOINT,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
const generateClient = (
    uri: string = DEFAULT_API_ENDPOINT,
    accessToken = '',
    refreshToken = '',
) => new ApolloClient({
    link: createHttpLink({
        uri,
        credentials: 'include',
        headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : undefined,
            'Authorization-Refresh': refreshToken ? `Bearer Refresh ${refreshToken}` : undefined,
        },
    }),
    cache: new InMemoryCache(),
});
// #endregion module



// #region exports
export default generateClient;
// #endregion exports
