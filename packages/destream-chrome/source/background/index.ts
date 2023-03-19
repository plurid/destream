const sendMessage = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    const response = await chrome.tabs.sendMessage(
        tab.id,
        {
            event: {
                type: 'youtubePlayPause',
            },
        },
    );

    console.log(response);
    return response;
}

const openTab = async (
    url: string,
) => {
    return await chrome.tabs.create({
        url,
        // active: false,
    });
}


class ConnectionManager {
    private subscriptions: Record<string, any> = {};

    public listen() {
        const subscriptionListener = (
            changes: {
                [key: string]: chrome.storage.StorageChange;
            },
        ) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (key === 'subscriptions') {
                    for (const subscription of newValue) {
                        if (!this.subscriptions[subscription]) {
                            this.subscriptions[subscription] = 'subscription';
                        }
                    }
                }
            }
        }

        chrome.storage.onChanged.addListener(subscriptionListener);
    }
}

const connectionManager = new ConnectionManager();
connectionManager.listen();


const publishEvent = (
    data: any,
) => {
    const publishEndpoint = '';

    fetch(publishEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    try {
        console.log(request.message);

        const data = JSON.parse(request.message);
        publishEvent(data.event);
    } catch (error) {
        return;
    }
});



const NOTIFICATION_URL_CHANGE = 'destream-url-change';

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
                    console.log({url});
                    break;
            }

            delete notifications[notificationID];
        }
    },
);


const sendNotification = (
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


// chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//     if (request.type === "getTabId") {
//         var tabId = sender.tab.id;

//         try {
//             const result = await chrome.storage.local.get([`tab-settings-${tabId}`]);

//             sendResponse({tabId: tabId, result});
//         } catch (error) {
//             sendResponse({tabId: tabId});
//             return true;
//         }
//     }

//     return true;
// });
