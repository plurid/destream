// #region imports
    // #region external
    import {
        DestreamEvent,
        MessagePublishEvent,
        ResponsePublishEvent,
        MessageGetSession,
        ResponseGetSession,
        MessageStartAnotherSession,
        RequestStopSession,
        RequestURLChange,
        Session,

        storagePrefix,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        DESTREAM_DETECT_EVENT,
        GENERAL_EVENT,
        ASYNCHRONOUS_RESPONSE,
    } from '~data/index';

    import MessagerClient from '../client';

    import {
        composeEventData,
    } from '~background/sessions';

    import {
        sendMessage,
        messageAddListener,
    } from '~common/messaging';

    import {
        storageAddListener,
    } from '~common/storage';

    import {
        MessageListener,
    } from '~common/types';

    import {
        storageGetIsStreamer,
    } from '~common/storage';

    import {
        StorageChange,
    } from '~common/types';

    import {
        log,
    } from '~common/utilities';


    import {
        checkNetflixOrigin,
    } from '~contentscript/utilities/netflix';

    import {
        checkSpotifyOrigin,
    } from '~contentscript/utilities/spotify';

    import {
        checkTwitchOrigin,
    } from '~contentscript/utilities/twitch';

    import {
        checkYoutubeOrigin,
    } from '~contentscript/utilities/youtube';
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
        sendMessage<MessagePublishEvent, ResponsePublishEvent>(
            {
                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.PUBLISH_EVENT,
                data: event.detail,
            },
            (response) => {
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
        request: RequestStopSession,
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
        request: RequestURLChange,
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
        request: MessageStartAnotherSession,
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
            return ASYNCHRONOUS_RESPONSE;
        }

        switch (request.type) {
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SESSION:
                stopSession(request);
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.URL_CHANGE:
                urlChange(request);
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.START_ANOTHER_SESSION:
                startAnotherSession(request);
                break;
        }

        sendResponse();
        return ASYNCHRONOUS_RESPONSE;
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

        const sessionRequest = await sendMessage<MessageGetSession, ResponseGetSession>({
            type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SESSION,
        });
        if (!sessionRequest || !sessionRequest.status) {
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
            runLogic as any,
        );


        const initialState = await detector.getCurrentState();
        const initalEvent = new CustomEvent<DestreamEvent>(
            DESTREAM_DETECT_EVENT,
            {
                detail: {
                    type: GENERAL_EVENT.INITIAL_STATE,
                    payload: initialState,
                },
            },
        );
        runLogic(initalEvent);


        const publishCurrentState = async (
            message: any,
        ) => {
            if (!detector || !session) {
                return;
            }

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
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SESSION,
            session,
        });
    });
}
// #endregion module



// #region exports
export default runStreamer;
// #endregion exports
