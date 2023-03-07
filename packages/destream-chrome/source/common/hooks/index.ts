// #region imports
    // #region libraries
    import {
        useState,
        useEffect,
    } from 'react';
    // #endregion libraries


    // #region external
    import {
        storageGetIsStreamer,
    } from '../logic';
    // #endregion external
// #endregion imports



// #region module
export const useLoggedIn = () => {
    const [
        loggedIn,
        setLoggedIn,
    ] = useState(false);

    useEffect(() => {
        const loggedInListener = (
            changes: {
                [key: string]: chrome.storage.StorageChange;
            },
        ) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (key === 'loggedIn' && oldValue !== newValue) {
                    setLoggedIn(newValue);
                }
            }
        }

        const getLoggedIn = async () => {
            const result = await chrome.storage.local.get(['loggedIn']);
            if (result.loggedIn) {
                setLoggedIn(true);
            }
        }

        getLoggedIn();
        chrome.storage.onChanged.addListener(loggedInListener);

        return () => {
            chrome.storage.onChanged.removeListener(loggedInListener);
        };
    }, []);

    return [
        loggedIn,
        setLoggedIn,
    ] as const;
}


export const useIsStreamer = () => {
    const [
        isStreamer,
        setIsStreamer,
    ] = useState(false);

    useEffect(() => {
        const isStreamerListener = (
            changes: {
                [key: string]: chrome.storage.StorageChange;
            },
        ) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (key === 'isStreamer' && oldValue !== newValue) {
                    setIsStreamer(newValue);
                }
            }
        }

        const getIsStreamer = async () => {
            const isStreamer = await storageGetIsStreamer();
            if (isStreamer) {
                setIsStreamer(true);
            }
        }

        getIsStreamer();
        chrome.storage.onChanged.addListener(isStreamerListener);

        return () => {
            chrome.storage.onChanged.removeListener(isStreamerListener);
        };
    }, []);

    return [
        isStreamer,
        setIsStreamer,
    ] as const;
}
// #endregion module
