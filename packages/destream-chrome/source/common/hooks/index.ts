// #region imports
    // #region libraries
    import {
        useState,
        useEffect,
    } from 'react';
    // #endregion libraries


    // #region external
    import {
        Session,
    } from '../../data';

    import {
        getSession,
        getSessionAudience
    } from '../../background/sessions';

    import {
        getActiveTab,
    } from '../logic';

    import {
        storageGetIsStreamer,
    } from '../storage';
    // #endregion external
// #endregion imports



// #region module
export const useLoggedIn = () => {
    const [
        loggedIn,
        setLoggedIn,
    ] = useState(false);

    const [
        identonym,
        setIdentonym,
    ] = useState('');


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
            const result = await chrome.storage.local.get(['loggedIn', 'identonym']);
            if (result.loggedIn) {
                setLoggedIn(true);
            }

            if (result.identonym) {
                setIdentonym(result.identonym);
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
        identonym,
        setIdentonym,
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


export const useSession = () => {
    const [
        session,
        setSession,
    ] = useState<Session | undefined>();

    const [
        sessionAudience,
        setSessionAudience,
    ] = useState(0);


    const sessionLoader = async (
        tabID?: number,
    ) => {
        if (!tabID) {
            const activeTab = await getActiveTab();
            if (!activeTab) {
                return;
            }
            tabID = activeTab.id;
        }

        const session = await getSession(tabID);
        if (session) {
            setSession(session);

            const sessionAudience = await getSessionAudience(session.id);
            if (sessionAudience.status) {
                setSessionAudience(sessionAudience.data);
            }
        }
    }

    useEffect(() => {
        sessionLoader();
    }, []);

    return [
        session,
        sessionLoader,
        setSession,
        sessionAudience,
    ] as const;
}
// #endregion module
