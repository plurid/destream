// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        DESTREAM_DETECT_EVENT,
        PublishEventMessage,
        PublishEventResponse,
        GetSessionMessage,

        DEFAULT_API_ENDPOINT,
    } from '../../data';

    import MessagerClient from '../client';

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
    let detector: Detector | undefined;

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

                client.publish(
                    DEFAULT_API_ENDPOINT,
                    response.data.topic,
                    response.data.message,
                );
            },
        );
    };

    const run = async () => {
        const isStreamer = await storageGetIsStreamer();
        if (!isStreamer) {
            return () => {};
        }

        const sessionRequest = await sendMessage<GetSessionMessage>({
            type: MESSAGE_TYPE.GET_SESSION,
        });
        if (!sessionRequest.status) {
            return () => {};
        }


        const endpoint = DEFAULT_API_ENDPOINT;
        await client.addMessager(endpoint);


        detector = getDetector();
        detector.target.addEventListener(
            DESTREAM_DETECT_EVENT,
            runLogic,
        );

        return () => {
            detector.target.removeEventListener(
                DESTREAM_DETECT_EVENT,
                runLogic,
            );
        }
    }

    let runCleanup = await run();

    const storageLogic = async () => {
        runCleanup();
        runCleanup = await run();
    }

    chrome.storage.onChanged.addListener(storageLogic);

    return () => {
        runCleanup();
        chrome.storage.onChanged.removeListener(storageLogic);

        if (detector) {
            detector.target.removeEventListener(
                DESTREAM_DETECT_EVENT,
                runLogic,
            );
        }
    }
}
// #endregion module



// #region exports
export default runStreamer;
// #endregion exports
