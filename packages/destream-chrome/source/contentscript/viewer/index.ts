// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        GENERAL_EVENT,
        YOUTUBE_EVENT,
        SPOTIFY_EVENT,
        GetSubscriptionMessage,
        StopSubscriptionMessage,
        StartSubscriptionByIDMessage,
        Subscription,
    } from '../../data';

    import {
        log,
    } from '../../common/utilities';

    import {
        sendMessage,
    } from '../../common/messaging';

    import {
        getCurrentStateArbitraryTopicID,
    } from '../../background/utilities';

    import MessagerClient from '../client';
    // #endregion external


    // #region internal
    import {
        generalScrollTo,
        generalURLChange,
    } from './controllers/general';

    import {
        youtubePlay,
        youtubePause,
        youtubeSeek,
        youtubeVolumeChange,
        youtubeRateChange,
        youtubeLike,
        youtubeApplyCurrentState,
    } from './controllers/youtube';

    import {
        spotifyPlayPause,
        spotifySeek,
        spotifyVolumeChange,
    } from './controllers/spotify';
    // #endregion internal
// #endregion imports



// #region module
export const applyCurrentState = (
    state: any,
) => {
    switch (window.location.host) {
        case 'www.youtube.com':
            youtubeApplyCurrentState(state);
            break;
    }
}


export const handleEvent = (
    event: DestreamEvent,
) => {
    try {
        switch (event.type) {
            case GENERAL_EVENT.SCROLL:
                generalScrollTo(event.payload.top, event.payload.left);
                break;
            case GENERAL_EVENT.URL_CHANGE:
                generalURLChange(event.payload.url);
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
    let setup = false;
    let lastResync: number | undefined;
    let subscription: Subscription | undefined;


    const requestCurrentState = async () => {
        if (!subscription) {
            return;
        }

        const currentStateArbitraryTopic = getCurrentStateArbitraryTopicID(subscription.currentStateTopic);

        await client.subscribe(
            subscription.endpoint,
            currentStateArbitraryTopic,
            (message) => {
                try {
                    const data: DestreamEvent = JSON.parse(message.data);
                    if (data.type === GENERAL_EVENT.CURRENT_STATE) {
                        applyCurrentState(data.payload);
                    }
                } catch (error) {
                    log(error);
                } finally {
                    client.unsubscribe(
                        subscription.endpoint,
                        currentStateArbitraryTopic,
                    );
                }
            },
        );

        setTimeout(async () => {
            await client.publish(
                subscription.endpoint,
                subscription.currentStateTopic,
                {
                    topic: currentStateArbitraryTopic,
                },
            );
        }, 500);
    }

    const messageHandler = (
        message: {
            sessionID: string;
            data: string;
        },
        subscription: Subscription,
    ) => {
        if (message.sessionID !== subscription.sessionID) {
            return;
        }

        try {
            const data: DestreamEvent = JSON.parse(message.data);

            switch (data.type) {
                case GENERAL_EVENT.STOP_SESSION:
                    sendMessage<StopSubscriptionMessage>(
                        {
                            type: MESSAGE_TYPE.STOP_SUBSCRIPTION,
                            data: subscription.sessionID,
                        },
                    );

                    client.unsubscribe(
                        subscription.endpoint,
                        subscription.publishTopic,
                    );
                    break;
                case GENERAL_EVENT.START_ANOTHER_SESSION:
                    sendMessage<StartSubscriptionByIDMessage>(
                        {
                            type: MESSAGE_TYPE.START_SUBSCRIPTION_BY_ID,
                            data: data.payload.newSessionID,
                        },
                    );
                    break;
                default:
                    handleEvent(data);
                    break;
            }
        } catch (error) {
            log(error);
        }
    }

    const messageListener = (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void,
    ) => {
        if (!subscription || !request?.type) {
            sendResponse();
            return true;
        }

        switch (request.type) {
            case GENERAL_EVENT.RESYNC_SESSION:
                // Check if lastResync is too recent.
                if (lastResync) {
                    const now = Date.now();
                    const difference = now - lastResync;
                    lastResync = now;
                    if (difference < 30 * 1_000) {
                        break;
                    }
                } else {
                    lastResync = Date.now();
                }

                requestCurrentState();
                break;
        }

        sendResponse();
        return true;
    }


    const run = async () => {
        const subscriptionRequest = await chrome.runtime.sendMessage<GetSubscriptionMessage>({
            type: MESSAGE_TYPE.GET_SUBSCRIPTION,
        });
        if (!subscriptionRequest.status) {
            return;
        }

        if (setup) {
            return;
        } else {
            setup = true;
        }


        subscription = subscriptionRequest.subscription;

        await client.addMessager(subscription.endpoint);

        await client.subscribe(
            subscription.endpoint,
            subscription.publishTopic,
            (message) => {
                messageHandler(message, subscription);
            },
        );

        setTimeout(async () => {
            await requestCurrentState();
        }, 500);
    }


    await run();

    const storageLogic = async () => {
        await run();
    }


    chrome.storage.onChanged.addListener(storageLogic);
    chrome.runtime.onMessage.addListener(messageListener);

}
// #endregion module



// #region exports
export default runViewer;
// #endregion exports
