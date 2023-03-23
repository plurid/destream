// #region imports
    // #region external
    import {
        NOTIFICATION_URL_CHANGE,
    } from '../data';
    // #endregion external
// #endregion imports



// #region module
export interface NotificationURLChangeData {
    tabID: number;
    url: string;
}

const notifications: Record<string, NotificationURLChangeData | undefined> = {};


chrome.notifications.onButtonClicked.addListener(
    (notificationID, buttonIndex) => {
        chrome.notifications.clear(notificationID);

        if (notificationID.startsWith(NOTIFICATION_URL_CHANGE)) {
            switch (buttonIndex) {
                case 0:
                    // Cancel
                    break;
                case 1:
                    // Access Website
                    const data = notifications[notificationID];
                    if (!data) {
                        return;
                    }

                    const {
                        tabID,
                        url,
                    } = data;

                    chrome.tabs.update(
                        tabID,
                        {
                            url,
                        },
                    );
                    break;
            }

            delete notifications[notificationID];
        }
    },
);


export const sendNotificationURLChange = (
    streamerName: string,
    tabID: number,
    url: string,
) => {
    const notificationID = `${NOTIFICATION_URL_CHANGE}-${Date.now()}`;
    notifications[notificationID] = {
        tabID,
        url,
    };

    chrome.notifications.create(
        notificationID,
        {
            type: 'basic',
            iconUrl: 'assets/icons/icon.png',
            title: 'URL Change',
            message: `Streamer '${streamerName}' wants to change the URL to '${url}'.`,
            buttons: [
                {
                    title: 'Cancel',
                },
                {
                    title: 'Access Website',
                },
            ],
            isClickable: true,
            requireInteraction: true,
            priority: 2,
        },
    );

    return notificationID;
}
// #endregion module
