// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
        PublishEventMessage,
        PublishEventResponse,
        GetSessionMessage,
        StartAnotherSessionMessage,
        Session,
    } from '../../data';

    import MessagerClient from '../client';

    import {
        composeEventData,
    } from '../../background/sessions';

    import {
        sendMessage,
    } from '../../common/messaging';

    import {
        storageGetIsStreamer,
    } from '../../common/storage';

    import {
        checkYoutubeOrigin,
    } from '../utilities/youtube';

    import {
        checkSpotifyOrigin,
    } from '../utilities/spotify';
    // #endregion external


    // #region internal
    import {
        Detector,
        GeneralDetector,
    } from './detectors';

    import {
        YoutubeDetector,
    } from './detectors/youtube';

    import {
        SpotifyDetector,
    } from './detectors/spotify';
    // #endregion internal
// #endregion imports



// #region module
const getDetector = (): Detector => {
    if (checkYoutubeOrigin()) return new YoutubeDetector();
    if (checkSpotifyOrigin()) return new SpotifyDetector();

    return new GeneralDetector();
}


const runStreamer = async (
    client: MessagerClient,
) => {
    let setup = false;
    let detector: Detector | undefined;
    let session: Session | undefined;
    let endpoint: string | undefined;


    const runLogic = (event: CustomEvent<DestreamEvent>) => {
        sendMessage<PublishEventMessage>(
            {
                type: MESSAGE_TYPE.PUBLISH_EVENT,
                data: event.detail,
            },
            (response: PublishEventResponse) => {
                if (!response.status) {
                    return;
                }

                if (!endpoint) {
                    return;
                }

                client.publish(
                    endpoint,
                    response.data.topic,
                    response.data.message,
                );
            },
        );
    };


    const stopSession = (
        request: any,
    ) => {
        const {
            session,
        } = request;

        const event = composeEventData(session, {
            type: GENERAL_EVENT.STOP_SESSION,
        });

        client.publish(
            endpoint,
            session.publishTopic,
            event,
        );
    }

    const urlChange = (
        request: any,
    ) => {
        const event = composeEventData(request.session, {
            type: GENERAL_EVENT.URL_CHANGE,
            payload: {
                url: request.url,
            },
        });

        client.publish(
            endpoint,
            request.topic,
            event,
        );
    }

    const startAnotherSession = (
        request: StartAnotherSessionMessage,
    ) => {
        const {
            session,
            newSessionID,
        } = request.data;

        const event = composeEventData(session, {
            type: GENERAL_EVENT.START_ANOTHER_SESSION,
            payload: {
                newSessionID,
            },
        });

        client.publish(
            endpoint,
            session.publishTopic,
            event,
        );
    }

    const messageListener = (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void,
    ) => {
        if (!endpoint) {
            sendResponse();
            return true;
        }

        switch (request.type) {
            case GENERAL_EVENT.STOP_SESSION:
                stopSession(request);
                break;
            case GENERAL_EVENT.URL_CHANGE:
                urlChange(request);
                break;
            case GENERAL_EVENT.START_ANOTHER_SESSION:
                startAnotherSession(request);
                break;
        }

        sendResponse();
        return true;
    }


    const run = async () => {
        const isStreamer = await storageGetIsStreamer();
        if (!isStreamer) {
            return;
        }

        const sessionRequest = await sendMessage<GetSessionMessage>({
            type: MESSAGE_TYPE.GET_SESSION,
        });
        if (!sessionRequest.status) {
            return;
        }

        if (setup) {
            return;
        } else {
            setup = true;
        }


        // const {
        //     session,
        // }: { session: Session } = sessionRequest;

        session = sessionRequest.session;

        const {
            endpoint: sessionEndpoint,
        } = session;

        endpoint = sessionEndpoint;
        await client.addMessager(endpoint);


        detector = getDetector();
        detector.target.addEventListener(
            DESTREAM_DETECT_EVENT,
            runLogic,
        );


        const publishCurrentState = async () => {
            const currentState = await detector.getCurrentState();

            client.publish(
                endpoint,
                session.publishTopic,
                composeEventData(session, {
                    type: GENERAL_EVENT.CURRENT_STATE,
                    payload: currentState,
                }),
            );
        }

        client.subscribe(
            endpoint,
            session.joinTopic,
            () => {
                publishCurrentState();
            },
        );
    }


    await run();

    const storageLogic = async () => {
        await run();
    }


    chrome.storage.onChanged.addListener(storageLogic);
    chrome.runtime.onMessage.addListener(messageListener);

    window.addEventListener('beforeunload', (_event) => {
        if (!session) {
            return;
        }

        stopSession({
            session,
        });
    });
}
// #endregion module



// #region exports
export default runStreamer;
// #endregion exports
