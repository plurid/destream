// #region imports
    // #region external
    import {
        NOTIFICATION_URL_CHANGE,
    } from '../data';
    // #endregion external
// #endregion imports



// #region module
const notifications: Record<string, string | undefined> = {};


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
                    const url = notifications[notificationID];
                    if (!url) {
                        return;
                    }
                    // console.log({url});
                    break;
            }

            delete notifications[notificationID];
        }
    },
);


export const sendNotificationURLChange = (
    url: string,
) => {
    const notificationID = `${NOTIFICATION_URL_CHANGE}-${Date.now()}`;
    notifications[notificationID] = url;

    chrome.notifications.create(
        notificationID,
        {
            type: "basic",
            iconUrl: "assets/icons/icon.png",
            title: "URL Change",
            message: `Streamer wants to change the URL to '${url}'.`,
            buttons: [
                {
                    title: "Cancel",
                },
                {
                    title: "Access Website",
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
