// #region imports
    // #region external
    import {
        DestreamEvent,
    } from '../data';

    import {
        storageGetIsStreamer,
    } from '../common/logic';
    // #endregion external


    // #region internal
    import {
        Detector,
    } from './detectors';

    import {
        YoutubeDetector,
    } from './detectors/youtube';

    import {
        checkYoutubeOrigin,
    } from './utilities/youtube';
    // #endregion internal
// #endregion imports



// #region module
const getDetector = (): Detector | undefined => {
    if (checkYoutubeOrigin()) return new YoutubeDetector();

    return;
}


export const runStreamer = () => {
    const run = async () => {
        const isStreamer = await storageGetIsStreamer();
        if (!isStreamer) {
            return;
        }

        const detector = getDetector();
        if (!detector) {
            return;
        }

        detector.target.addEventListener(
            'destreamDetect',
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
