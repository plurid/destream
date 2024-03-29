// #region imports
    // #region external
    import {
        Handler,
        MessageStartSession,
        ResponseMessage,

        DEFAULT_API_ENDPOINT,
    } from '~data/index';

    import {
        storageGetIsStreamer,
        storageGetIdentonym,
    } from '~common/storage';

    import {
        log,
    } from '~common/utilities';

    import {
        startSession,
        notifyStartAnotherSession,
    } from '../sessions';

    import {
        START_SESSION,
    } from '../graphql';

    import {
        getTab,
        getPublishTopicID,
        getCurrentStateTopicID,
        getDefaultGraphqlClient,
    } from '../utilities'
    // #endregion external
// #endregion imports



// #region module
const handleStartSession: Handler<MessageStartSession, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    try {
        const isStreamer = await storageGetIsStreamer();
        const identonym = await storageGetIdentonym();
        const tab = await getTab(request.data.tabID);
        if (!isStreamer || !identonym || !tab) {
            sendResponse({
                status: false,
            });
            return;
        }

        const graphqlClient = await getDefaultGraphqlClient();

        const graphqlRequest = await graphqlClient.mutate({
            mutation: START_SESSION,
            variables: {
                input: {
                    url: request.data.url,
                    title: request.data.title,
                    incognito: tab.incognito,
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

            const publishTopic = getPublishTopicID(id);
            const currentStateTopic = getCurrentStateTopicID(id);

            await startSession(
                request.data.tabID,
                id,
                identonym,
                publishTopic,
                currentStateTopic,
                token,
                pubsubEndpoint,
            );

            await notifyStartAnotherSession(id);
        }

        sendResponse({
            status: response.status,
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
export default handleStartSession;
// #endregion exports
