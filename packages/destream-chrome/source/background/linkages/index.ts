// #region imports
    // #region external
    import {
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetTokens,
    } from '../../common/storage';

    import {
        generateClient,

        GET_LINKAGES_OF_URL,
        GET_LINKAGE,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
export const getLinkagesOfURL = async (
    url: string,
) => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const graphqlRequest = await graphqlClient.mutate({
        mutation: GET_LINKAGES_OF_URL,
        variables: {
            input: {
                value: url,
            },
        },
    });
    const response = graphqlRequest.data.destreamGetLinkagesOfURL;
    if (!response.status) {
        return [];
    }

    return response.data;
}


export const getLinkage = async (
    id: string,
) => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );

    const graphqlRequest = await graphqlClient.mutate({
        mutation: GET_LINKAGE,
        variables: {
            input: {
                value: id,
            },
        },
    });
    const response = graphqlRequest.data.destreamGetLinkage;
    if (!response.status) {
        return;
    }

    return {
        ...response.data,
        sessions: JSON.parse(response.data.sessions),
    };
}
// #endregion module
