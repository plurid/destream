// #region module
export const loginLogic = async (
    identonym: string,
    key: string,
) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    // receive from network
    const user = {
        loginToken: 'login-token',
        isStreamer: true,
    };

    const {
        loginToken,
        isStreamer,
    } = user;

    await chrome.storage.local.set({
        loginToken,
        isStreamer,
        loggedIn: true,
    });

    return true;
}
// #endregion module
