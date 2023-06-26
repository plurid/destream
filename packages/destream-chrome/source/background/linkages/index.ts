// #region imports
    // #region external
    import {
        storagePrefix,
        Linkage,
        LinkageOfURL,
    } from '~data/index';

    import {
        storageGetAll,
        storageRemove,
        storageSessionGet,
        storageSessionSet,
    } from '~common/storage';

    import {
        GET_LINKAGES_OF_URL,
        GET_LINKAGE,
    } from '../graphql';

    import {
        getDefaultGraphqlClient,
        hashValue,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export const getLinkageStorageID = (
    tabID: number,
) => {
    return storagePrefix.linkage + tabID;
}

export const getURLLinkagesStorageID = (
    url: string,
) => {
    const urlHash = hashValue(url);
    return storagePrefix.urlLinkages + urlHash;
}


export const getLinkagesOfURL = async (
    url: string,
) => {
    const graphqlClient = await getDefaultGraphqlClient();

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
    const graphqlClient = await getDefaultGraphqlClient();

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
    const linkage = linkages.find(linkage => linkage.tabID === tabID);

    return linkage;
}


export const storeURLLinkages = async (
    url: string,
    data: LinkageOfURL[],
) => {
    const id = getURLLinkagesStorageID(url);
    await storageSessionSet(id, data);
}

export const getURLLinkages = async (
    url: string,
) => {
    const id = getURLLinkagesStorageID(url);
    const data = await storageSessionGet<LinkageOfURL[]>(id) || [];

    return data;
}


export const stopLinkageWithTabID = async (
    tabID: number,
) => {
    const linkageID = getLinkageStorageID(tabID);
    await storageRemove(linkageID);
}
// #endregion module
