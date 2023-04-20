// #region imports
    // #region external
    import {
        Handler,
        StopSessionMessage,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetIsStreamer,
        storageGetIdentonym,
        storageGetTokens,
    } from '../../common/logic';

    import {
        getSession,
        deleteSession,
    } from '../session';

    import {
        generateClient,
        STOP_SESSION,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
const handleStopSession: Handler<StopSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const emptyResponse = async () => {
        // Try session delete anyway.
        await deleteSession(request.data.tabID);

        sendResponse({
            status: false,
        });

        return;
    }

    const isStreamer = await storageGetIsStreamer();
    const identonym = await storageGetIdentonym();
    if (!isStreamer || !identonym) {
        return await emptyResponse();
    }

    const session = await getSession(request.data.tabID);
    if (!session) {
        return await emptyResponse();
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
        mutation: STOP_SESSION,
        variables: {
            input: {
                value: session.id,
            },
        },
    });
    const response = graphqlRequest.data.destreamStopSession;

    if (response.status) {
        await deleteSession(request.data.tabID);
    }

    sendResponse({
        status: response.status,
    });

    return;
}
// #endregion module



// #region exports
export default handleStopSession;
// #endregion exports
