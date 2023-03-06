// #region module
export const loginLogic = async (
    identonym: string,
    key: string,
) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    const loginToken = 'login-token';
    await chrome.storage.local.set({ loginToken });
    await chrome.storage.local.set({ loggedIn: true });

    return true;
}
// #endregion module
