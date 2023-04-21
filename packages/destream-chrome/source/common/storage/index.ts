// #region module
export const storageGetAll = async () => {
    try {
        const storage: any = await chrome.storage.local.get(null);

        return storage;
    } catch (error) {
        return {};
    }
}

export const storageRemove = async (
    id: string,
) => {
    await chrome.storage.local.remove(id);
}

export const storageGet = async <T = any>(
    id: string | string[],
): Promise<T | undefined> => {
    try {
        if (Array.isArray(id)) {
            const result = await chrome.storage.local.get(id);
            return result as T;
        }

        const result = await chrome.storage.local.get([id]);
        return result[id];
    } catch (error) {
        return;
    }
}

export const storageSet = async <T = any>(
    id: string,
    value: T,
) => {
    try {
        await chrome.storage.local.set({
            [id]: value,
        });

        return true;
    } catch (error) {
        return false;
    }
}



export const storageGetIsStreamer = async () => {
    const result = await chrome.storage.local.get(['isStreamer']);
    return !!result.isStreamer;
}

export const storageGetTokens = async () => {
    const result = await chrome.storage.local.get(['accessToken', 'refreshToken']);

    return {
        accessToken: (result.accessToken as string) || '',
        refreshToken: (result.refreshToken as string) || '',
    };
}

export const storageGetIdentonym = async (): Promise<string> => {
    const result = await chrome.storage.local.get(['identonym']);
    return result.identonym || '';
}
// #endregion module
