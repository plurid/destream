// #region imports
    // #region external
    import {
        DestreamEvent,
    } from '../data';
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
    // #endregion internal
// #endregion imports



// #region module
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


export const runViewer = () => {
    const run = async () => {
        // if session is started
        // listen for events

        chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
            handleEvent(request.event);

            sendResponse({
                status: true,
            });
        });
    }

    run();
    chrome.storage.onChanged.addListener(run);
}
// #endregion module
