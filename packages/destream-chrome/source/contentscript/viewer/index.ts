// #region imports
    // #region external
    import {
        DestreamEvent,
        Message,
        MESSAGE_TYPE,
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        SPOTIFY_EVENT,
        GetSubscriptionMessage,
    } from '../../data';

    import MessagerClient from '../client';
    // #endregion external


    // #region internal
    import {
        generalScrollTo,
    } from './controllers/general';

    import {
        youtubePlayPause,
        youtubeSeek,
        youtubeVolumeChange,
        youtubeRateChange,
        youtubeLike,
    } from './controllers/youtube';

    import {
        spotifyPlayPause,
        spotifySeek,
        spotifyVolumeChange,
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
            case YOUTUBE_EVENT.SEEK:
                youtubeSeek(event.payload);
                break;
            case YOUTUBE_EVENT.VOLUME_CHANGE:
                youtubeVolumeChange(event.payload);
                break;
            case YOUTUBE_EVENT.RATE_CHANGE:
                youtubeRateChange(event.payload);
                break;
            case YOUTUBE_EVENT.LIKE:
                youtubeLike();
                break;

            case SPOTIFY_EVENT.PLAY:
            case SPOTIFY_EVENT.PAUSE:
                spotifyPlayPause();
                break;
            case SPOTIFY_EVENT.SEEK:
                spotifySeek(event.payload);
                break;
            case SPOTIFY_EVENT.VOLUME_CHANGE:
                spotifyVolumeChange(event.payload);
                break;
        }
    } catch (error) {
        return;
    }
}

export const handleMessage = (
    request: Message,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    if (request.type !== MESSAGE_TYPE.DESTREAM_EVENT) {
        return;
    }

    handleEvent(request.data);

    sendResponse({
        status: true,
    });
}


const runViewer = async (
    client: MessagerClient,
) => {
    const run = async () => {
        const subscriptionRequest = await chrome.runtime.sendMessage<GetSubscriptionMessage>({
            type: MESSAGE_TYPE.GET_SUBSCRIPTION,
        });
        if (!subscriptionRequest.status) {
            return () => {};
        }

        const endpoint = '';
        await client.addMessager(endpoint);

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
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
    }
}
// #endregion module



// #region exports
export default runViewer;
// #endregion exports
