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
        StopSessionRequest,
        URLChangeRequest,
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
        log,
    } from '../../common/utilities';

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

                if (!session) {
                    return;
                }

                client.publish(
                    session.endpoint,
                    response.data.topic,
                    response.data.message,
                );
            },
        ).catch(log);
    };


    const stopSession = (
        request: StopSessionRequest,
    ) => {
        const {
            session,
        } = request;

        const event = composeEventData(session, {
            type: GENERAL_EVENT.STOP_SESSION,
        });

        client.publish(
            session.endpoint,
            session.publishTopic,
            event,
        );
    }

    const urlChange = (
        request: URLChangeRequest,
    ) => {
        const {
            session,
            url,
        } = request;

        const event = composeEventData(request.session, {
            type: GENERAL_EVENT.URL_CHANGE,
            payload: {
                url,
            },
        });

        client.publish(
            session.endpoint,
            session.publishTopic,
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
            session.endpoint,
            session.publishTopic,
            event,
        );
    }

    const messageListener = (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void,
    ) => {
        if (!session || !request?.type) {
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


        session = sessionRequest.session;

        await client.addMessager(session.endpoint);


        detector = getDetector();
        detector.target.addEventListener(
            DESTREAM_DETECT_EVENT,
            runLogic,
        );


        const publishCurrentState = async (
            message: any,
        ) => {
            const currentState = await detector.getCurrentState();

            client.publish(
                session.endpoint,
                message.topic,
                composeEventData(session, {
                    type: GENERAL_EVENT.CURRENT_STATE,
                    payload: currentState,
                }),
            );
        }

        client.subscribe(
            session.endpoint,
            session.currentStateTopic,
            (message) => {
                publishCurrentState(message);
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
            type: GENERAL_EVENT.STOP_SESSION,
            session,
        });
    });
}
// #endregion module



// #region exports
export default runStreamer;
// #endregion exports
