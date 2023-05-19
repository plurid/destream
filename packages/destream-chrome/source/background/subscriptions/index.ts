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
        storagePrefix,
        storageFields,
        DEFAULT_API_ENDPOINT,
        GeneralPermissions,
    } from '../../data';

    import {
        storageGet,
        storageSet,
        storageGetAll,
        storageRemove,
        storageGetTokens,
    } from '../../common/storage';

    import {
        generateClient,
        STOP_SESSION_SUBSCRIPTION,
        START_SESSION_SUBSCRIPTION,
    } from '../graphql';

    import {
        sendNotificationSessionStart,
    } from '../notifications';

    import {
        getPublishTopicID,
        getJoinTopicID,
        removeTabSettings,
        openTab,
        assignTabToGroup,
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
        joinTopic: getJoinTopicID(sessionID),
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
    const result = await chrome.storage.local.get([storageFields.subscriptions]);
    if (!result.subscriptions) {
        return;
    }

    await chrome.storage.local.set({
        subscriptions: result.subscriptions.filter((name: string) => name !== streamer),
    });
}


export const stopSubscription = async (
    subscription: Subscription,
) => {
    const {
        accessToken,
        refreshToken,
    } = await storageGetTokens();
    const graphqlClient = generateClient(
        DEFAULT_API_ENDPOINT,
        accessToken,
        refreshToken,
    );
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
    streamerIdentonym: string,
    generalPermissions: GeneralPermissions,
    streamerDetails: any,
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

        const tab = await openTab(sessionURL);
        await assignTabToGroup(tab, streamerIdentonym, generalPermissions);

        const pubsubEndpoint = sessionCustomPubSubLink || DEFAULT_API_ENDPOINT;

        if (generalPermissions?.useNotifications) {
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
        return false;
    }
}
// #endregion module
