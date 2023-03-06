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
