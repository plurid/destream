// #region imports
    // #region external
    import {
        DEFAULT_API_ENDPOINT,
        storagePrefix,
        Linkage,
    } from '../../data';

    import {
        storageGetTokens,
        storageGetAll,
    } from '../../common/storage';

    import {
        generateClient,

        GET_LINKAGES_OF_URL,
        GET_LINKAGE,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
export const getLinkageStorageID = (
    tabID: number,
) => {
    return storagePrefix.linkage + tabID;
}



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


export const getLinkages = async () => {
    try {
        const storage = await storageGetAll();
        const linkages = Object
            .keys(storage)
            .filter(item => item.startsWith(storagePrefix.linkage))
            .map(id => storage[id]);

        return linkages as Linkage[];
    } catch (error) {
        return [];
    }
}


export const getLinkageByTabID = async (
    tabID: number,
): Promise<Linkage | undefined> => {
    const linkages = await getLinkages();
    console.log({linkages});
    const linkage = linkages.find(linkage => linkage.tabID === tabID);

    return linkage;
}
// #endregion module
