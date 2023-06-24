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
        storagePrefix,
    } from '../../data';

    import MessagerClient from '../client';

    import {
        composeEventData,
    } from '../../background/sessions';

    import {
        sendMessage,
        messageAddListener,
    } from '../../common/messaging';

    import {
        storageAddListener,
    } from '../../common/storage';

    import {
        MessageListener,
    } from '../../common/types';

    import {
        storageGetIsStreamer,
    } from '../../common/storage';

    import {
        StorageChange,
    } from '../../common/types';

    import {
        log,
    } from '../../common/utilities';


    import {
        checkNetflixOrigin,
    } from '../utilities/netflix';

    import {
        checkSpotifyOrigin,
    } from '../utilities/spotify';

    import {
        checkTwitchOrigin,
    } from '../utilities/twitch';

    import {
        checkYoutubeOrigin,
    } from '../utilities/youtube';
    // #endregion external


    // #region internal
    import metadata from './metadata';

    import {
        Detector,
        GeneralDetector,
    } from './detectors';

    import {
        NetflixDetector,
    } from './detectors/netflix';

    import {
        SpotifyDetector,
    } from './detectors/spotify';

    import {
        TwitchDetector,
    } from './detectors/twitch';

    import {
        YoutubeDetector,
    } from './detectors/youtube';
    // #endregion internal
// #endregion imports



// #region module
const getDetector = (): Detector => {
    if (checkNetflixOrigin()) return new NetflixDetector();
    if (checkSpotifyOrigin()) return new SpotifyDetector();
    if (checkTwitchOrigin()) return new TwitchDetector();
    if (checkYoutubeOrigin()) return new YoutubeDetector();

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

    const messageListener: MessageListener<any, any> = (
        request,
        _sender,
        sendResponse,
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


    const checkTabSettings = (
        changes: { [key: string]: StorageChange },
    ) => {
        if (!session) {
            return;
        }

        for (const key of Object.keys(changes)) {
            if (
                key.startsWith(storagePrefix.tabSettings)
                && key.endsWith(session.tabID + '')
            ) {
                const change = changes[key];
                metadata.setStreamCursor(!!change.newValue?.streamCursor);
            }
        }
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

    const storageLogic = async (
        changes: { [key: string]: StorageChange },
    ) => {
        checkTabSettings(changes);

        await run();
    }


    storageAddListener(storageLogic);
    messageAddListener(messageListener);

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
