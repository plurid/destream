// #region module
export const storageGetAll = async () => {
    try {
        // Forced await.
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

export const storageSetMultiple = async <T = Record<string, any>>(
    values: T,
) => {
    try {
        await chrome.storage.local.set({
            ...values,
        });

        return true;
    } catch (error) {
        return false;
    }
}

export const storageUpdate = async <T = any>(
    id: string,
    value: T,
) => {
    try {
        const item = await storageGet(id);
        if (!item) {
            return await storageSet(id, {
                ...value,
            });
        }

        return await storageSet(id, {
            ...item,
            ...value,
        });
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



export const storageAddListener = (
    listener: (changes: {
        [key: string]: chrome.storage.StorageChange;
    }) => void,
) => {
    chrome.storage.onChanged.addListener(listener);
}

export const storageRemoveListener = (
    listener: (changes: {
        [key: string]: chrome.storage.StorageChange;
    }) => void,
) => {
    chrome.storage.onChanged.removeListener(listener);
}
// #endregion module
