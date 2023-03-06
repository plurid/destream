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
    private subscriptions: any[] = [];

    public addNewSubscription() {
    }

    public listen() {

    }
}

const connectionManager = new ConnectionManager();
connectionManager.listen();
