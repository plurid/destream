// #region imports
    // #region external
    import {
        NOTIFICATION_KIND,
        Notification,
    } from '../data';
    // #endregion external
// #endregion imports



// #region module
const NOTIFICATIONS_TYPE = 'basic';
const NOTIFICATIONS_ICON_URL = 'assets/icons/icon.png';
const defaultNewNotification = {
    type: NOTIFICATIONS_TYPE,
    iconUrl: NOTIFICATIONS_ICON_URL,
} as const;


const notifications: Record<string, Notification | undefined> = {};



chrome.notifications.onButtonClicked.addListener(
    (notificationID, buttonIndex) => {
        chrome.notifications.clear(notificationID);

        if (notificationID.startsWith(NOTIFICATION_KIND.URL_CHANGE)) {
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
    const notificationID = `${NOTIFICATION_KIND.URL_CHANGE}-${Date.now()}`;
    notifications[notificationID] = {
        kind: NOTIFICATION_KIND.URL_CHANGE,
        tabID,
        url,
    };

    chrome.notifications.create(
        notificationID,
        {
            ...defaultNewNotification,
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


export const sendNotificationSessionStart = (
    streamerName: string,
    tabID: number,
    url: string,
) => {
    const notificationID = `${NOTIFICATION_KIND.SESSION_START}-${Date.now()}`;
    notifications[notificationID] = {
        kind: NOTIFICATION_KIND.SESSION_START,
        tabID,
        streamer: streamerName,
        url,
    };

    chrome.notifications.create(
        notificationID,
        {
            ...defaultNewNotification,
            title: 'Session Start',
            message: `Started session for streamer '${streamerName}'.`,
        },
    );

    return notificationID;
}
// #endregion module
