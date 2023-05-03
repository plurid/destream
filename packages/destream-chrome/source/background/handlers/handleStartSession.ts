// #region imports
    // #region external
    import {
        Handler,
        StartSessionMessage,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetIsStreamer,
        storageGetIdentonym,
        storageGetTokens,
    } from '../../common/storage';

    import {
        startSession,
    } from '../session';

    import {
        generateClient,
        START_SESSION,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
const handleStartSession: Handler<StartSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const isStreamer = await storageGetIsStreamer();
    const identonym = await storageGetIdentonym();
    if (!isStreamer || !identonym) {
        sendResponse({
            status: false,
        });
        return;
    }

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
        mutation: START_SESSION,
        variables: {
            input: {
                url: request.data.url,
                title: request.data.title,
            },
        },
    });
    const response = graphqlRequest.data.destreamStartSession;

    if (response.status) {
        const {
            id,
            token,
            customPubSubLink,
        } = response.data;

        const pubsubEndpoint = customPubSubLink || DEFAULT_API_ENDPOINT;

        await startSession(
            request.data.tabID,
            id,
            identonym,
            token,
            pubsubEndpoint,
        );
    }

    sendResponse({
        status: response.status,
    });

    return;
}
// #endregion module



// #region exports
export default handleStartSession;
// #endregion exports
