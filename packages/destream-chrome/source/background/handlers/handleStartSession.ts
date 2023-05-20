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
        log,
    } from '../../common/utilities';

    import {
        startSession,
        notifyStartAnotherSession,
    } from '../sessions';

    import {
        generateClient,
        START_SESSION,
    } from '../graphql';

    import {
        getPublishTopicID,
        getCurrentStateTopicID,
    } from '../utilities'
    // #endregion external
// #endregion imports



// #region module
const handleStartSession: Handler<StartSessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    try {
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
