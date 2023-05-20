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
        log,
    } from '../../common/utilities';

    import {
        getSession,
        composeEventData,
    } from '../sessions';

    import {
        generateClient,
        RECORD_SESSION_EVENT,
    } from '../graphql';

    import {
        getPublishTopicID,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handlePublishEvent: Handler<PublishEventMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    try {
        const session = await getSession(sender.tab.id);
        if (!session) {
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

        const topic = getPublishTopicID(session.id);
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
    } catch (error) {
        log(error);

        sendResponse({
            status: false,
        });

        return;
    }
}
// #endregion module



// #region exports
export default handlePublishEvent;
// #endregion exports
