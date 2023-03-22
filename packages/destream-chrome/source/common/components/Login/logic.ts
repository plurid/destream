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
        isStreamer,
        loginToken,
    } = user;

    await chrome.storage.local.set({
        identonym,
        isStreamer,
        loginToken,
        loggedIn: true,
    });

    return true;
}
// #endregion module
