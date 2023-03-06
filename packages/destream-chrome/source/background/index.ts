setTimeout(() => {
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

        const response = await chrome.tabs.sendMessage(
            tab.id,
            {
                event: {
                    type: 'youtubePlayPause',
                },
            },
        );

        console.log(response);
    })();
}, 3000);
