// #region imports
    // #region external
    import {
        Handler,
        MessagePublishEvent,
        ResponsePublishEvent,
    } from '~data/interfaces';

    import {
        log,
    } from '~common/utilities';

    import {
        getSession,
        composeEventData,
    } from '../sessions';

    import {
        RECORD_SESSION_EVENT,
    } from '../graphql';

    import {
        getPublishTopicID,
        getDefaultGraphqlClient,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handlePublishEvent: Handler<MessagePublishEvent, ResponsePublishEvent> = async (
    request,
    sender,
    sendResponse,
) => {
    try {
        if (!sender.tab || !sender.tab.id) {
            sendResponse({
                status: false,
            });
            return;
        }

        const session = await getSession(sender.tab.id);
        if (!session) {
            sendResponse({
                status: false,
            });
            return;
        }

        const graphqlClient = await getDefaultGraphqlClient();

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
        sendResponse({
            status: true,
            data: {
                token: session.token,
                topic,
                message: event,
            },
        });

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
