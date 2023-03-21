// #region imports
    // #region external
    import {
        DEFAULT_PUBLISH_ENDPOINT,
    } from '../data';
    // #endregion external
// #endregion imports



// #region module
// class ConnectionManager {
//     private subscriptions: Record<string, any> = {};

//     public listen() {
//         const subscriptionListener = (
//             changes: {
//                 [key: string]: chrome.storage.StorageChange;
//             },
//         ) => {
//             for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//                 if (key === 'subscriptions') {
//                     for (const subscription of newValue) {
//                         if (!this.subscriptions[subscription]) {
//                             this.subscriptions[subscription] = 'subscription';
//                         }
//                     }
//                 }
//             }
//         }

//         chrome.storage.onChanged.addListener(subscriptionListener);
//     }
// }

// const connectionManager = new ConnectionManager();
// connectionManager.listen();


export const publishEvent = (
    data: any,
    publishEndpoint = DEFAULT_PUBLISH_ENDPOINT,
) => {
    try {
        fetch(
            publishEndpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            },
        );
    } catch (error) {
        console.log(error);
    }
}
// #endregion module
