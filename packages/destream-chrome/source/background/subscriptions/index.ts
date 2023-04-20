// #region imports
    // #region external
    import {
        Subscription,
    } from '../../data';

    import {
        composeTopicID,
    } from '../session';
    // #endregion external
// #endregion imports



// #region module
export const getSubscriptionStorageID = (
    sessionID: string,
) => {
    return `subscription-${sessionID}`;
}


export const startSubscription = async (
    streamer: string,
    sessionID: string,
    tabID: number,
) => {
    try {
        const id = getSubscriptionStorageID(sessionID);
        const subscription: Subscription = {
            sessionID,
            topic: composeTopicID(sessionID),
            startedAt: Date.now(),
            streamer,
            tabID,
        };

        await chrome.storage.local.set({
            [id]: subscription,
        });
    } catch (error) {
        return;
    }
}


export const deleteSubscription = async (
    sessionID: string,
) => {
    const id = getSubscriptionStorageID(sessionID);
    await chrome.storage.local.remove(id);
}


export const getSubscriptions = async () => {
    try {
        const storage: any = await chrome.storage.local.get(null);
        const subscriptionsIDs = Object
            .keys(storage)
            .filter(item => item.startsWith('subscription-'));

        const subscriptions = subscriptionsIDs.map(id => storage[id]);

        return subscriptions as Subscription[];
    } catch (error) {
        return;
    }
}


export const getSubscriptionByTabID = async (
    tabID: number,
) => {
    try {
        const subscriptions = await getSubscriptions();
        const subscription = subscriptions.find(subscription => subscription.tabID === tabID);

        return subscription;
    } catch (error) {
        return;
    }
}


export const getSubscription = async (
    sessionID: string,
) => {
    try {
        const id = getSubscriptionStorageID(sessionID);
        const result = await chrome.storage.local.get([id]);
        return result[id];
    } catch (error) {
        return;
    }
}
// #endregion module
