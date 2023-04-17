// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        DESTREAM_DETECT_EVENT,
        PublishEventMessage,
        GetTabIDMessage,
        GetSessionMessage,
    } from '../data';

    import {
        storageGetIsStreamer,
    } from '../common/logic';
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

    import {
        checkYoutubeOrigin,
    } from './utilities/youtube';

    import {
        checkSpotifyOrigin,
    } from './utilities/spotify';
    // #endregion internal
// #endregion imports



// #region module
const getDetector = (): Detector => {
    if (checkYoutubeOrigin()) return new YoutubeDetector();
    if (checkSpotifyOrigin()) return new SpotifyDetector();

    return new GeneralDetector();
}


export const runStreamer = () => {
    let detector: Detector | undefined;

    const runLogic = (event: CustomEvent<DestreamEvent>) => {
        chrome.runtime.sendMessage<PublishEventMessage>({
            type: MESSAGE_TYPE.PUBLISH_EVENT,
            data: event.detail,
        });
    };

    const run = async () => {
        const isStreamer = await storageGetIsStreamer();
        if (!isStreamer) {
            return;
        }

        const sessionRequest = await chrome.runtime.sendMessage<GetSessionMessage>({
            type: MESSAGE_TYPE.GET_SESSION,
        });
        if (!sessionRequest.status) {
            return;
        }

        detector = getDetector();
        detector.target.addEventListener(
            DESTREAM_DETECT_EVENT,
            runLogic,
        );
    }

    run();
    chrome.storage.onChanged.addListener(run);

    return () => {
        chrome.storage.onChanged.removeListener(run);

        if (detector) {
            detector.target.removeEventListener(
                DESTREAM_DETECT_EVENT,
                runLogic,
            );
        }
    }
}
// #endregion module
