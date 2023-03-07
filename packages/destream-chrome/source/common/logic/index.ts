// #region module
export const storageGetIsStreamer = async () => {
    const result = await chrome.storage.local.get(['isStreamer']);
    return !!result.isStreamer;
}
// #endregion module
