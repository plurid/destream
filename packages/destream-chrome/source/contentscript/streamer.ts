// #region imports
    // #region external
    import {
        DestreamEvent,
        DESTREAM_DETECT_EVENT,
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
    const run = async () => {
        const isStreamer = await storageGetIsStreamer();
        if (!isStreamer) {
            return;
        }

        const detector = getDetector();
        detector.target.addEventListener(
            DESTREAM_DETECT_EVENT,
            (event: CustomEvent<DestreamEvent>) => {
                chrome.runtime.sendMessage({
                    type: 'publishEvent',
                    event: JSON.stringify({
                        type: 'destreamEvent',
                        data: event.detail,
                    }),
                });
            },
        );
    }

    run();
    chrome.storage.onChanged.addListener(run);
}
// #endregion module
