// #region imports
    // #region libraries
    import type {
        ApolloClient,
        NormalizedCacheObject,
    } from '@apollo/client';
    // #endregion libraries


    // #region external
    import {
        Subscription,
        StreamerDetails,
        GeneralPermissions,
        RequestStopSubscription,

        storagePrefix,
        storageFields,
        DEFAULT_API_ENDPOINT,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        DESTREAM_GROUP_PREFIX,
    } from '~data/index';

    import {
        storageGet,
        storageSet,
        storageSetMultiple,
        storageGetAll,
        storageRemove,
    } from '~common/storage';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        tabsUngroup,
    } from '~common/tab';

    import {
        log,
    } from '~common/utilities';

    import {
        STOP_SESSION_SUBSCRIPTION,
        START_SESSION_SUBSCRIPTION,
    } from '../graphql';

    import {
        sendNotificationSessionStart,
    } from '../notifications';

    import {
        getPublishTopicID,
        getCurrentStateTopicID,
        removeTabSettings,
        openTab,
        assignTabToGroup,
        getDefaultGraphqlClient,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export const getSubscriptionStorageID = (
    sessionID: string,
) => {
    return storagePrefix.subscription + sessionID;
}


export const startSubscription = async (
    streamer: string,
    streamerDetails: StreamerDetails,
    sessionID: string,
    subscriptionID: string,
    endpoint: string,
    tabID: number,
) => {
    const id = getSubscriptionStorageID(sessionID);
    const subscription: Subscription = {
        sessionID,
        subscriptionID,
        publishTopic: getPublishTopicID(sessionID),
        currentStateTopic: getCurrentStateTopicID(sessionID),
        startedAt: Date.now(),
        streamer,
        tabID,
        endpoint,
        streamerDetails,
    };

    storageSet(id, subscription);
}


export const getSubscriptions = async () => {
    try {
        const storage = await storageGetAll();
        const subscriptions = Object
            .keys(storage)
            .filter(item => item.startsWith(storagePrefix.subscription))
            .map(id => storage[id]);

        return subscriptions as Subscription[];
    } catch (error) {
        return [];
    }
}


export const getSubscriptionByTabID = async (
    tabID: number,
): Promise<Subscription | undefined> => {
    const subscriptions = await getSubscriptions();
    const subscription = subscriptions.find(subscription => subscription.tabID === tabID);

    return subscription;
}


export const getSubscriptionsByStreamerName = async (
    streamer: string,
) => {
    const subscriptions = await getSubscriptions();
    const streamerSubscriptions = subscriptions.filter(subscription => subscription.streamer === streamer);

    return streamerSubscriptions;
}


export const getSubscription = async (
    sessionID: string,
): Promise<Subscription | undefined> => {
    const id = getSubscriptionStorageID(sessionID);
    return await storageGet<Subscription>(id);
}


export const deleteSubscription = async (
    sessionID: string,
) => {
    const id = getSubscriptionStorageID(sessionID);
    await storageRemove(id);
}


export const removeStreamerSubscription = async (
    streamer: string,
) => {
    const result = await storageGet([storageFields.subscriptions]);
    if (!result.subscriptions) {
        return;
    }

    await storageSetMultiple({
        subscriptions: result.subscriptions.filter((name: string) => name !== streamer),
    });
}


export const stopSubscription = async (
    subscription: Subscription,
) => {
    const graphqlClient = await getDefaultGraphqlClient();

    await graphqlClient.mutate({
        mutation: STOP_SESSION_SUBSCRIPTION,
        variables: {
            input: {
                sessionID: subscription.sessionID,
                subscriptionID: subscription.subscriptionID,
            },
        },
    });

    await deleteSubscription(subscription.sessionID);
    await removeTabSettings(subscription.tabID);
    await removeStreamerSubscription(subscription.streamer);

    await sendMessageToTab<RequestStopSubscription>(subscription.tabID, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.STOP_SUBSCRIPTION,
    }).catch(() => {
        // Ignore error if tab does not exist.
    });

    await tabsUngroup(subscription.tabID).catch(() => {
        // Ignore error if tab does not exist.
    });
}


export const stopSubscriptionWithTabID = async (
    tabID: number,
) => {
    const subscription = await getSubscriptionByTabID(tabID);
    if (!subscription) {
        return;
    }

    await stopSubscription(subscription);
}


export const startSessionSubscriptionLogic = async (
    graphqlClient: ApolloClient<NormalizedCacheObject>,
    sessionID: string,
    sessionURL: string,
    sessionCustomPubSubLink: string | undefined,
    sessionIncognito: boolean | undefined,
    streamerIdentonym: string,
    generalPermissions: GeneralPermissions,
    streamerDetails: StreamerDetails,
) => {
    try {
        const sessionSubscription = await graphqlClient.mutate({
            mutation: START_SESSION_SUBSCRIPTION,
            variables: {
                input: {
                    value: sessionID,
                },
            },
        });
        const sessionSubscriptionResponse = sessionSubscription.data.destreamStartSessionSubscription;
        if (!sessionSubscriptionResponse.status) {
            return false;
        }

        const tab = await openTab(
            sessionURL, false, sessionIncognito,
        );
        const groupTitle = DESTREAM_GROUP_PREFIX + streamerIdentonym;
        await assignTabToGroup(
            tab, groupTitle, generalPermissions,
        );

        const pubsubEndpoint = sessionCustomPubSubLink || DEFAULT_API_ENDPOINT;

        if (generalPermissions.useNotifications) {
            sendNotificationSessionStart(
                streamerIdentonym,
                tab.id,
                sessionURL,
            );
        }

        await startSubscription(
            streamerIdentonym,
            streamerDetails,
            sessionID,
            sessionSubscriptionResponse.data,
            pubsubEndpoint,
            tab.id,
        );

        return true;
    } catch (error) {
        log(error);
        return false;
    }
}
// #endregion module
