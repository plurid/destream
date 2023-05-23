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
        InputLine,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_TYPE,
        uncontrollableURLsBase,
        DEFAULT_API_ENDPOINT,
        storagePrefix,
    } from '../../../data/constants';

    import {
        StartSessionMessage,
        StopSessionMessage,
        StopSubscriptionMessage,
        GetSessionMessage,
        GetSubscriptionMessage,
        Subscription,
        Replayment,
        ReplaySessionMessage,
    } from '../../../data/interfaces';

    import {
        storageSet,
        storageGet,
        storageGetTokens,
    } from '../../../common/storage';

    import {
        sendMessage,
    } from '../../../common/messaging';

    import {
        generateClient,
        GET_SESSION,
    } from '../../../background/graphql';

    import {
        getTabSettingsID,
        getTabSettings,
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

    import {
        log,
    } from '../../../common/utilities';
    // #endregion external


    // #region internal
    import {
        StyledPopup,
        StyledTabControl,
        StyledURLText,
        buttonStyle,
    } from './styled';

    import DestreamTitle from './components/DestreamTitle';
    import DestreamOptions from './components/DestreamOptions';
    import ReplaymentComponent from './components/Replayment';
    // #endregion internal
// #endregion imports



// #region module
const Popup: React.FC<any> = (
    _properties,
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
        sessionLoader,
        setSession,
        sessionAudience,
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
        replayment,
        setReplayment,
    ] = useState<Replayment | null>(null);

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

    const [
        destreamID,
        setDestreamID,
    ] = useState('');

    const [
        showReplayDestream,
        setShowReplayDestream,
    ] = useState(false);

    const [
        resyncingSession,
        setResyncingSession,
    ] = useState(false);
    // #endregion state


    // #region handlers
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
                    sessionLoader(activeTab.id);
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
                    setSession(undefined);
                }
            },
        );
    }

    const loadDestream = async () => {
        try {
            setDestreamID('');

            const {
                accessToken,
                refreshToken,
            } = await storageGetTokens();
            const graphqlClient = generateClient(
                DEFAULT_API_ENDPOINT,
                accessToken,
                refreshToken,
            );

            const request = await graphqlClient.query({
                query: GET_SESSION,
                variables: {
                    input: {
                        value: destreamID.trim().replace('destream://', ''),
                    },
                },
            });

            const response = request.data.destreamGetSession;
            if (!response.status) {
                return;
            }

            const {
                data,
            } = response;

            await sendMessage<ReplaySessionMessage>(
                {
                    type: MESSAGE_TYPE.REPLAY_SESSION,
                    data,
                },
                () => {
                    setShowReplayDestream(false);
                },
            );
        } catch (error) {
            log(error);
        }
    }

    const resyncSession = async () => {
        if (!activeTab) {
            return;
        }

        setResyncingSession(true);

        await sendMessage<any>(
            {
                type: MESSAGE_TYPE.RESYNC_SESSION,
                data: activeTab.id,
            },
            () => {
                setResyncingSession(false);
            },
        );
    }
    // #endregion handlers


    // #region effects
    /** setLoading */
    useEffect(() => {
        setTimeout(() => {
            // Give time for useLoggedIn to fire.
            setLoading(false);
        }, 150);
    }, []);

    /** getActiveTab */
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

    /** loadTabSettings */
    useEffect(() => {
        if (!activeTab) {
            return;
        }

        const loadTabSettings = async () => {
            const tabSettings = await getTabSettings(activeTab.id);
            if (!tabSettings) {
                return;
            }

            setShowStream(tabSettings.showStream);
            setShowStreamChat(tabSettings.showStreamChat);
        }

        loadTabSettings();
    }, [
        activeTab,
    ]);

    /** setSettings */
    useEffect(() => {
        if (!activeTab) {
            return;
        }
        if (!session && !subscription) {
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

    /** getSession, getSubscription, getReplayment */
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

            const replayment = await storageGet(storagePrefix.replayment + activeTab.id);
            if (replayment) {
                setReplayment(replayment);
            }
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

    if (showReplayDestream) {
        return (
            <StyledPopup>
                <h1>
                    replay destream
                </h1>

                <InputLine
                    name="destream id"
                    text={destreamID}
                    atChange={(event) => {
                        setDestreamID(event.target.value);
                    }}
                    textline={{
                        enterAtClick: () => {
                            loadDestream();
                        },
                    }}
                    theme={plurid}
                    style={{
                        width: '280px',
                    }}
                />

                <LinkButton
                    text="cancel"
                    atClick={() => {
                        setShowReplayDestream(false);
                    }}
                    theme={plurid}
                    style={{
                        margin: '1rem 0',
                    }}
                />
            </StyledPopup>
        );
    }

    if (replayment) {
        return (
            <StyledPopup>
                <ReplaymentComponent
                    replayment={replayment}
                    activeTab={activeTab}
                    setReplayment={setReplayment}
                />
            </StyledPopup>
        );
    }

    return (
        <StyledPopup>
            <DestreamTitle />


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
                    <StyledURLText>
                        {activeTab.url}
                        <br />
                        is controlled by
                        <br />
                        {activeTabControlledBy}
                    </StyledURLText>

                    <PureButton
                        text="Stop Control"
                        atClick={() => {
                            stopSubscription();
                        }}
                        theme={plurid}
                        level={2}
                        style={buttonStyle}
                    />
                </StyledTabControl>
            )}

            {activeTab
            && !activeTabControlledBy
            && (
                <StyledTabControl>
                    {!sessionStarted && (
                        <StyledURLText>
                            {activeTab.url}
                            <br />
                            is not controlled
                        </StyledURLText>
                    )}

                    {sessionStarted && (
                        <StyledURLText>
                            you are controlling
                            <br />
                            {activeTab.url}
                        </StyledURLText>
                    )}

                    {sessionStarted && (
                        <div
                            style={{
                                marginTop: '1rem',
                            }}
                        >
                            {sessionAudience} viewers
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
                            style={buttonStyle}
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
                            style={buttonStyle}
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
            && activeTabControlledBy
            && (
                <div>
                    <LinkButton
                        text="resync session"
                        atClick={() => {
                            resyncSession();
                        }}
                        theme={plurid}
                        style={{
                            margin: '1rem auto',
                        }}
                        disabled={resyncingSession}
                    />

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


            <LinkButton
                text="replay destream"
                atClick={() => {
                    setShowReplayDestream(true);
                }}
                theme={plurid}
                style={{
                    margin: '1rem 0',
                }}
                inline={true}
            />


            {activeTab && (
                <Subscriptions
                    theme={plurid}
                    width={280}
                    removeSubscription={(name) => {
                        if (name === activeTabControlledBy) {
                            setActiveTabControlledBy('');
                            setSubscription(null);
                        }
                    }}
                />
            )}


            <DestreamOptions />
        </StyledPopup>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Popup;
// #endregion exports
