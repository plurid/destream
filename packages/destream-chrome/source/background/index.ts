const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    return tab;
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


// const DEFAULT_PUBLISH_ENDPOINT = 'https://api.plurid.com/graphql';
const DEFAULT_PUBLISH_ENDPOINT = 'http://localhost:3000/publish';


const publishEvent = (
    data: any,
    publishEndpoint = DEFAULT_PUBLISH_ENDPOINT,
) => {
    fetch(publishEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}



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
                    // console.log({url});
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


const handleGetTabID = (
    _request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    sendResponse({
        tabID: sender.tab.id,
    });

    return true;
}

const handleGetSession = async (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    const tabID = sender.tab.id;
    const id = `tab-settings-${tabID}`;

    try {
        const result = await chrome.storage.local.get([id]);
        sendResponse({
            session: result[id],
        });
    } catch (error) {
    }

    return true;
}

const handlePublishEvent = async (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
) => {
    const data = JSON.parse(request.event);
    publishEvent(data.event);

    return true;
}


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.type) {
        case 'publishEvent':
            return handlePublishEvent(request, sender, sendResponse);
        case 'getTabID':
            return handleGetTabID(request, sender, sendResponse);
        case 'getSession':
            return handleGetSession(request, sender, sendResponse);
    }

    return true;
});
