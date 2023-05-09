// #region imports
    // #region external
    import {
        Handler,
        PublishEventMessage,
        PublishEventResponse,
        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import {
        storageGetTokens,
    } from '../../common/storage';

    import {
        getSession,
        composeEventData,
    } from '../session';

    import {
        generateClient,
        RECORD_SESSION_EVENT,
    } from '../graphql';

    import {
        getTopicID,
    } from '../utilities';
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

    const event = composeEventData(session, request.data);

    const graphqlRequest = await graphqlClient.mutate({
        mutation: RECORD_SESSION_EVENT,
        variables: {
            input: event,
        },
    });
    const response = graphqlRequest.data.destreamRecordSessionEvent;
    if (!response.status) {
        sendResponse({
            status: false,
        });
        return;
    }

    const topic = getTopicID(session.id);
    const publishEventResponse: PublishEventResponse = {
        status: true,
        data: {
            token: session.token,
            topic,
            message: event,
        },
    };
    sendResponse(publishEventResponse);

    return;
}
// #endregion module



// #region exports
export default handlePublishEvent;
// #endregion exports
