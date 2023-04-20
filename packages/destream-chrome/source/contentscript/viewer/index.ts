// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        SPOTIFY_EVENT,
        GetSubscriptionMessage,

        DEFAULT_API_ENDPOINT,
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

        const endpoint = DEFAULT_API_ENDPOINT;
        await client.addMessager(endpoint);

        const {
            subscription,
        } = subscriptionRequest;

        await client.subscribe(
            DEFAULT_API_ENDPOINT,
            subscription.topic,
            (message) => {
                handleEvent(
                    JSON.parse(message.data),
                );
            },
        );

        return () => {
            client.unsubscribe(
                DEFAULT_API_ENDPOINT,
                subscription.topic,
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
    }
}
// #endregion module



// #region exports
export default runViewer;
// #endregion exports
