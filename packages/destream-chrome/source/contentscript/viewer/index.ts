// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        SPOTIFY_EVENT,
        GetSubscriptionMessage,
        Subscription,
    } from '../../data';

    import {
        log,
    } from '../../common/utilities';

    import MessagerClient from '../client';
    // #endregion external


    // #region internal
    import {
        generalScrollTo,
    } from './controllers/general';

    import {
        youtubePlay,
        youtubePause,
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
                youtubePlay();
                break;
            case YOUTUBE_EVENT.PAUSE:
                youtubePause();
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

        const {
            subscription,
        }: { subscription: Subscription } = subscriptionRequest;

        const {
            endpoint,
        } = subscription;

        await client.addMessager(endpoint);

        await client.subscribe(
            endpoint,
            subscription.topic,
            (message) => {
                if (message.sessionID !== subscription.sessionID) {
                    return;
                }

                try {
                    const data: DestreamEvent = JSON.parse(message.data);

                    if (data.type === GENERAL_EVENT.STOP_SESSION) {
                        client.unsubscribe(
                            endpoint,
                            subscription.topic,
                        );
                        return;
                    }

                    handleEvent(data);
                } catch (error) {
                    log(error);
                }
            },
        );

        return () => {
            client.unsubscribe(
                endpoint,
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
