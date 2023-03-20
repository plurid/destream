class SessionPlayer {
    public async sendMessage(
        tabID: number,
        event: any,
    ) {
        await chrome.tabs.sendMessage(
            tabID,
            {
                event,
            },
        );
    }
}
