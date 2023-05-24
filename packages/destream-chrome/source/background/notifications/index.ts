// #region imports
    // #region external
    import {
        NOTIFICATION_KIND,
        Notification,
    } from '../../data';
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

        if (notificationID.startsWith(NOTIFICATION_KIND.URL_FAILED_TO_CHANGE)) {
            switch (buttonIndex) {
                case 0:
                    // Open Options
                    chrome.runtime.openOptionsPage();
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

    const host = new URL(url).host;

    chrome.notifications.create(
        notificationID,
        {
            ...defaultNewNotification,
            title: 'URL Change',
            message: `${streamerName} wants to access ${host} (${url})`,
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


export const sendNotificationURLFailedToChange = (
    streamerName: string,
    tabID: number,
    url: string,
) => {
    const notificationID = `${NOTIFICATION_KIND.URL_FAILED_TO_CHANGE}-${Date.now()}`;
    notifications[notificationID] = {
        kind: NOTIFICATION_KIND.URL_CHANGE,
        tabID,
        url,
    };

    const host = new URL(url).host;

    chrome.notifications.create(
        notificationID,
        {
            ...defaultNewNotification,
            title: 'URL Failed to Change',
            message: `${streamerName} wanted to access ${host} · change permissions in the extension options to allow URL changes`,
            buttons: [
                {
                    title: 'Open Options',
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

    const host = new URL(url).host;

    chrome.notifications.create(
        notificationID,
        {
            ...defaultNewNotification,
            title: 'destream session',
            message: `${streamerName} started destream ${host} (${url})`,
        },
    );

    setTimeout(() => {
        chrome.notifications.clear(notificationID);
    }, 5_000);

    return notificationID;
}
// #endregion module
