// #region imports
    // #region external
    import {
        DestreamEvent,
        MESSAGE_TYPE,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        GENERAL_EVENT,
        MessageGetSubscription,
        ResponseGetSubscription,
        MessageStopSubscription,
        StartSubscriptionByIDMessage,
        Subscription,
        resyncTimeout,
    } from '../../data';

    import {
        sendMessage,
        messageAddListener,
    } from '../../common/messaging';

    import {
        storageAddListener,
    } from '../../common/storage';

    import {
        MessageListener,
    } from '../../common/types';

    import {
        log,
    } from '../../common/utilities';

    import {
        getCurrentStateArbitraryTopicID,
    } from '../../background/utilities';

    import {
        getTabSettings,
    } from '../messaging';

    import MessagerClient from '../client';

    import {
        eventsList,
    } from '../view/eventsList';
    // #endregion external


    // #region internal
    import {
        generateCursor,
        destroyCursor,
    } from './controllers/general';

    import {
        handleEvent,
    } from './event';

    import {
        applyCurrentState,
    } from './state';
    // #endregion internal
// #endregion imports



// #region module
export const setAutofocus = (
    requestCurrentState: () => void,
) => {
    // MAYBE check focus and activate less often
    // window.addEventListener('focus', () => {
    //     requestCurrentState();
    // });
}


const runViewer = async (
    client: MessagerClient,
) => {
    let setup = false;
    let lastResync: number | undefined;
    let subscription: Subscription | undefined;


    const verifyLastResync = () => {
        if (!lastResync) {
            lastResync = Date.now();
            return true;
        }

        const now = Date.now();
        const difference = now - lastResync;
        lastResync = now;

        if (difference < resyncTimeout) {
            return false;
        }

        lastResync = undefined;
        return true;
    }


    const requestCurrentState = async () => {
        if (!subscription) {
            return;
        }

        const allowResync = verifyLastResync();
        if (!allowResync) {
            return
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
                    destroyCursor();

                    sendMessage<MessageStopSubscription>({
                        type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.STOP_SUBSCRIPTION,
                        data: subscription.sessionID,
                    }).catch(log);

                    client.unsubscribe(
                        subscription.endpoint,
                        subscription.publishTopic,
                    );
                    break;
                case GENERAL_EVENT.START_ANOTHER_SESSION:
                    sendMessage<StartSubscriptionByIDMessage>({
                        type: MESSAGE_TYPE.START_SUBSCRIPTION_BY_ID,
                        data: data.payload.newSessionID,
                    }).catch(log);
                    break;
                default:
                    handleEvent(data);
                    break;
            }
        } catch (error) {
            log(error);
        }
    }

    const messageListener: MessageListener<any, any> = (
        request,
        _sender,
        sendResponse,
    ) => {
        if (!subscription || !request?.type) {
            sendResponse();
            return true;
        }

        switch (request.type) {
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SUBSCRIPTION:
                destroyCursor();

                client.unsubscribe(
                    subscription.endpoint,
                    subscription.publishTopic,
                );
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.RESYNC_SESSION:
                requestCurrentState();
                break;
        }

        sendResponse();
        return true;
    }


    const run = async () => {
        const subscriptionRequest = await sendMessage<MessageGetSubscription, ResponseGetSubscription>({
            type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_SUBSCRIPTION,
        });
        if (!subscriptionRequest.status) {
            return;
        }


        if (subscription) {
            const tabSettings = await getTabSettings(subscription.tabID);
            eventsList.setViewable(tabSettings?.showEventsList ?? false);
        }


        if (setup) {
            return;
        } else {
            setup = true;
        }


        subscription = subscriptionRequest.subscription;

        generateCursor(subscription.streamer);

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

        setAutofocus(requestCurrentState);
    }


    await run();

    const storageLogic = async () => {
        await run();
    }


    storageAddListener(storageLogic);
    messageAddListener(messageListener);
}
// #endregion module



// #region exports
export default runViewer;
// #endregion exports
