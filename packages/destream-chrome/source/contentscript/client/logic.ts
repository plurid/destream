// #region imports
    // #region external
    import generateClient from '../../background/graphql/client';

    import {
        GET_MESSAGER_DATA,
    } from '../../background/graphql/query';

    import {
        log,
    } from '../../common/utilities';
    // #endregion external


    // #region internal
    import {
        MessagerData,
    } from './data';
    // #endregion internal
// #endregion imports



// #region module
export const requestClientEndpointData = async (
    endpoint: string,
): Promise<MessagerData | undefined> => {
    try {
        const client = generateClient(endpoint);
        const request = await client.query({
            query: GET_MESSAGER_DATA,
        });

        const response = request.data?.destreamGetMessagerData;
        if (!response.status) {
            log(`could not get messager data from ${endpoint}`);
            return;
        }

        const endpointData = JSON.parse(response.data);
        return endpointData as MessagerData;
    } catch (error) {
        log(error);
        return;
    }
}
// #endregion module
