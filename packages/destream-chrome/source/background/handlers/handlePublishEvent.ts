// #region imports
    // #region external
    import {
        Handler,
        PublishEventMessage,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetTokens,
    } from '../../common/logic';

    import {
        publishEvent,
    } from '../event';

    import {
        getSession,
    } from '../session';

    import {
        generateClient,
        RECORD_SESSION_EVENT,
    } from '../graphql';
    // #endregion external
// #endregion imports



// #region module
const handlePublishEvent: Handler<PublishEventMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const session = await getSession(sender.tab.id);
    if (!session) {
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

    const relativeTime = Date.now() - session.startedAt;
    const data = JSON.stringify(request.data);

    const graphqlRequest = await graphqlClient.mutate({
        mutation: RECORD_SESSION_EVENT,
        variables: {
            input: {
                sessionID: session.id,
                relativeTime,
                data,
            },
        },
    });
    const response = graphqlRequest.data.destreamRecordSessionEvent;
    if (!response.status) {
        sendResponse({
            status: false,
        });
        return;
    }

    const published = publishEvent(session, request.data);
    sendResponse({
        status: published,
    });

    return;
}
// #endregion module



// #region exports
export default handlePublishEvent;
// #endregion exports