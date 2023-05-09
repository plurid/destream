// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        PureButton,
        LinkButton,
        Spinner,
        InputSwitch,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_TYPE,
        uncontrollableURLsBase,
    } from '../../../data/constants';

    import {
        StartSessionMessage,
        StopSessionMessage,
        StopSubscriptionMessage,
        GetSessionMessage,
        GetSubscriptionMessage,
        Subscription,
    } from '../../../data/interfaces';

    import {
        storageSet,
    } from '../../../common/storage';

    import {
        sendMessage,
    } from '../../../common/messaging';

    import {
        openOptionsPage,
    } from '../../../common/utilities';

    import {
        getTabSettingsID,
    } from '../../../background/utilities';

    import Login from '../../../common/components/Login';
    import Subscriptions from '../../../common/components/Subscriptions';

    import {
        useLoggedIn,
        useIsStreamer,
        useSession,
    } from '../../../common/hooks';

    import {
        getActiveTab,
    } from '../../../common/logic';
    // #endregion external


    // #region internal
    import {
        StyledPopup,
        StyledTabControl,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
const Popup: React.FC<any> = (
    properties,
) => {
    // #region state
    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        loggedIn,
        setLoggedIn,
    ] = useLoggedIn();

    const [
        isStreamer,
    ] = useIsStreamer();

    const [
        session,
    ] = useSession();

    const [
        activeTab,
        setActiveTab,
    ] = useState<chrome.tabs.Tab | null>(null);

    const [
        activeTabControlledBy,
        setActiveTabControlledBy,
    ] = useState('');

    const [
        controllableTab,
        setControllableTab,
    ] = useState(false);

    const [
        subscription,
        setSubscription,
    ] = useState<Subscription | null>(null);

    const [
        sessionStarted,
        setSessionStarted,
    ] = useState(false);

    const [
        showStream,
        setShowStream,
    ] = useState(false);

    const [
        showStreamChat,
        setShowStreamChat,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const openOptions = () => {
        openOptionsPage();
    }

    const stopSubscription = async () => {
        if (!activeTab || !subscription) {
            return;
        }

        setActiveTabControlledBy('');

        await sendMessage<StopSubscriptionMessage>({
            type: MESSAGE_TYPE.STOP_SUBSCRIPTION,
            data: subscription.sessionID,
        });
    }

    const startSession = async () => {
        if (!activeTab) {
            return;
        }

        setLoading(true);

        sendMessage<StartSessionMessage>(
            {
                type: MESSAGE_TYPE.START_SESSION,
                data: {
                    tabID: activeTab.id,
                    url: activeTab.url,
                    title: activeTab.title,
                },
            },
            (response) => {
                setLoading(false);

                if (response.status) {
                    setSessionStarted(true);
                }
            },
        );
    }

    const stopSession = async () => {
        if (!activeTab) {
            return;
        }

        setLoading(true);

        sendMessage<StopSessionMessage>(
            {
                type: MESSAGE_TYPE.STOP_SESSION,
                data: {
                    tabID: activeTab.id,
                    url: activeTab.url,
                },
            },
            (response: any) => {
                setLoading(false);

                if (response.status) {
                    setSessionStarted(false);
                }
            },
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        setTimeout(() => {
            // Give time for useLoggedIn to fire.
            setLoading(false);
        }, 150);
    }, []);

    useEffect(() => {
        const getTab = async () => {
            const tab = await getActiveTab();
            setActiveTab(tab);

            const isControllable = !uncontrollableURLsBase.some(
                start => tab.url.startsWith(start),
            );
            setControllableTab(isControllable);
        }

        getTab();
    }, []);

    useEffect(() => {
        if (!activeTab && (!session || !subscription)) {
            return;
        }

        const setSettings = async () => {
            const id = getTabSettingsID(activeTab.id);
            await storageSet(
                id,
                {
                    showStream,
                    showStreamChat,
                },
            );
        }

        setSettings();
    }, [
        activeTab,
        session,
        subscription,
        showStream,
        showStreamChat,
    ]);

    useEffect(() => {
        const load = async () => {
            if (!activeTab) {
                return;
            }

            sendMessage<GetSessionMessage>(
                {
                    type: MESSAGE_TYPE.GET_SESSION,
                    data: activeTab.id,
                },
                (response: any) => {
                    if (response.status) {
                        setSessionStarted(true);
                    }
                },
            );

            sendMessage<GetSubscriptionMessage>(
                {
                    type: MESSAGE_TYPE.GET_SUBSCRIPTION,
                    data: activeTab.id,
                },
                (response: any) => {
                    if (response.status) {
                        const subscription: Subscription = response.subscription;
                        setActiveTabControlledBy(subscription.streamer);
                        setSubscription(subscription);
                    }
                },
            );
        }

        load();
    }, [
        activeTab,
    ]);
    // #endregion effects


    // #region render
    if (loading) {
        return (
            <Spinner
                theme={plurid}
            />
        );
    }

    return (
        <StyledPopup>
            <h1>
                destream
            </h1>

            {!loggedIn && (
                <Login
                    theme={plurid}
                    atLogin={() => {
                        setLoggedIn(true);
                    }}
                />
            )}

            {activeTab
            && activeTabControlledBy
            && (
                <StyledTabControl>
                    <div>
                        {activeTab.url}
                        <br />
                        is controlled by
                        <br />
                        {activeTabControlledBy}
                    </div>

                    <PureButton
                        text="Stop Control"
                        atClick={() => {
                            stopSubscription();
                        }}
                        theme={plurid}
                        level={2}
                        style={{
                            marginTop: '1rem',
                        }}
                    />
                </StyledTabControl>
            )}

            {activeTab
            && !activeTabControlledBy
            && (
                <StyledTabControl>
                    {!sessionStarted && (
                        <div>
                            {activeTab.url}
                            <br />
                            is not controlled
                        </div>
                    )}

                    {sessionStarted && (
                        <div>
                            you are controlling
                            <br />
                            {activeTab.url}
                        </div>
                    )}

                    {isStreamer
                    && controllableTab
                    && !sessionStarted
                    && (
                        <PureButton
                            text="Start Session"
                            atClick={() => {
                                startSession();
                            }}
                            theme={plurid}
                            level={2}
                            style={{
                                marginTop: '1rem',
                            }}
                        />
                    )}

                    {isStreamer
                    && controllableTab
                    && sessionStarted
                    && (
                        <PureButton
                            text="Stop Session"
                            atClick={() => {
                                stopSession();
                            }}
                            theme={plurid}
                            level={2}
                            style={{
                                marginTop: '1rem',
                            }}
                        />
                    )}
                </StyledTabControl>
            )}

            {!activeTab
            && (
                <StyledTabControl>
                    <div>
                        select a web page
                    </div>
                </StyledTabControl>
            )}


            {activeTab
            && sessionStarted
            && (
                <div>
                    <InputSwitch
                        name="show stream"
                        checked={showStream}
                        atChange={() => {
                            setShowStream(!showStream);
                        }}
                        theme={plurid}
                    />

                    {showStream && (
                        <InputSwitch
                            name="show chat"
                            checked={showStreamChat}
                            atChange={() => {
                                setShowStreamChat(!showStreamChat);
                            }}
                            theme={plurid}
                        />
                    )}
                </div>
            )}


            {activeTab && (
                <Subscriptions
                    theme={plurid}
                    width={280}
                />
            )}


            <LinkButton
                text="options"
                atClick={() => {
                    openOptions();
                }}
                theme={plurid}
                style={{
                    marginTop: '2rem',
                }}
            />
        </StyledPopup>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Popup;
// #endregion exports
