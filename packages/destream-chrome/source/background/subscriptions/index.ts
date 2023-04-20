// #region imports
    // #region external
    import {
        Subscription,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
export const getSubscriptionStorageID = (
    sessionID: string,
) => {
    return `subscription-${sessionID}`;
}


export const startSubscription = async (
    sessionID: string,
    streamer: string,
) => {
    try {
        const id = getSubscriptionStorageID(sessionID);
        const subscription: Subscription = {
            sessionID,
            startedAt: Date.now(),
            streamer,
            tabIDs: [],
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

        return subscriptions;
    } catch (error) {
        return;
    }
}


export const getSubscriptionByTabID = async (
    tabID: number,
) => {
    try {
        const subscriptions = await getSubscriptions();
        const subscription = subscriptions.find(subscription => subscription.tabIDs.includes(tabID));

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
