// #region imports
    // #region external
    import {
        DestreamEvent,
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        SPOTIFY_EVENT,
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

    import {
        spotifyMute,
        spotifyPlayPause,
        spotifySeek,
    } from './controllers/spotify';
    // #endregion internal
// #endregion imports



// #region module
export const handleEvent = (
    event: DestreamEvent,
) => {
    try {
        switch (event.type) {
            case GENERAL_EVENT.SCROLL:
                generalScrollTo(event.payload.top, event.payload.left);
                break;

            case YOUTUBE_EVENT.PLAY:
            case YOUTUBE_EVENT.PAUSE:
                youtubePlayPause();
                break;
            case 'youtubeMute':
                youtubeMute();
                break;
            case YOUTUBE_EVENT.LIKE:
                youtubeLike();
                break;
            case YOUTUBE_EVENT.SEEK:
                youtubeSeek(event.payload ?? 0);
                break;

            case 'spotifyMute':
                spotifyMute();
                break;
            case SPOTIFY_EVENT.PLAY:
            case SPOTIFY_EVENT.PAUSE:
                spotifyPlayPause();
                break;
            case SPOTIFY_EVENT.SEEK:
                spotifySeek(event.payload ?? 0);
                break;
        }
    } catch (error) {
        return;
    }
}


export const runViewer = () => {
    const runLogic = (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void,
    ) => {
        handleEvent(request.event);

        sendResponse({
            status: true,
        });
    }

    const run = async () => {
        // if session is started
        // listen for events

        chrome.runtime.onMessage.addListener(runLogic);
    }

    run();
    chrome.storage.onChanged.addListener(run);

    return () => {
        chrome.runtime.onMessage.removeListener(runLogic);
        chrome.storage.onChanged.removeListener(run);
    }
}
// #endregion module
