// #region imports
    // #region external
    import {
        storageGetIsStreamer,
    } from '../common/logic';
    // #endregion external


    // #region internal
    import {
        generalScrollTo,
    } from './controllers/general';

    import {
        youtubeMute,
        youtubePlayPause,
        youtubeLike,
        youtubeSeek,
    } from './controllers/youtube';

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
export interface DestreamEvent {
    type: string;
    payload?: any;
}

export const handleEvent = (
    event: DestreamEvent,
) => {
    switch (event.type) {
        case 'generalScroll':
            generalScrollTo(event.payload.top, event.payload.left);
            break;
        case 'youtubePlayPause':
            youtubePlayPause();
            break;
        case 'youtubeMute':
            youtubeMute();
            break;
        case 'youtubeLike':
            youtubeLike();
            break;
        case 'youtubeSeek':
            youtubeSeek(event.payload ?? 0);
            break;
    }
}


chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    handleEvent(request.event);

    sendResponse({
        status: true,
    });
});


const getDetector = (): Detector | undefined => {
    if (checkYoutubeOrigin()) return new YoutubeDetector();

    return;
}


const main = () => {
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
                    message: JSON.stringify({
                        type: 'destreamEvent',
                        event: event.detail,
                    }),
                });
            },
        );
    }

    run();
    chrome.storage.onChanged.addListener(run);
}

main();
// #endregion module
