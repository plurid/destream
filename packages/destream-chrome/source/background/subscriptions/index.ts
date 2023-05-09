// #region imports
    // #region external
    import {
        Subscription,
        storagePrefix,
        storageFields,
    } from '../../data';

    import {
        storageGet,
        storageSet,
        storageGetAll,
        storageRemove,
    } from '../../common/storage';

    import {
        getTopicID,
        removeTabSettings,
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
    sessionID: string,
    endpoint: string,
    tabID: number,
) => {
    const id = getSubscriptionStorageID(sessionID);
    const subscription: Subscription = {
        sessionID,
        topic: getTopicID(sessionID),
        startedAt: Date.now(),
        streamer,
        tabID,
        endpoint,
    };

    storageSet(id, subscription);
}


export const deleteSubscription = async (
    sessionID: string,
) => {
    const id = getSubscriptionStorageID(sessionID);
    await storageRemove(id);
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


export const stopSubscriptionWithTabID = async (
    tabID: number,
) => {
    const subscription = await getSubscriptionByTabID(tabID);
    if (!subscription) {
        return;
    }

    await deleteSubscription(subscription.sessionID);
    await removeTabSettings(subscription.tabID);
    await removeStreamerSubscription(subscription.streamer);
}
// #endregion module
