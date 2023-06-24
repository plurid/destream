// #region module
export const notificationCreate = async (
    id: string,
    options: chrome.notifications.NotificationOptions<true>,
) => {
    chrome.notifications.create(
        id,
        options,
    );
}


export const notificationClear = async (
    id: string,
) => {
    chrome.notifications.clear(id);
}


export const notificationOnButtonClickedAddListener = (
    listener: (
        notificationId: string,
        buttonIndex: number,
    ) => void,
) => {
    chrome.notifications.onButtonClicked.addListener(listener);
}
// #endregion module
