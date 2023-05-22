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
        Slider,
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
        DESTREAM_WWW_URL,
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
        ReplaymentIndexMessage,
        ReplaymentPlayMessage,
        ReplaymentPauseMessage,
        ReplaymentStopMessage,
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
        openOptionsPage,
    } from '../../../common/utilities';

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

    const stopReplayment = async () => {
        if (!replayment || !activeTab) {
            return;
        }

        setReplayment(null);

        await sendMessage<ReplaymentStopMessage>(
            {
                type: MESSAGE_TYPE.REPLAYMENT_STOP,
                data: activeTab.id,
            },
            () => {
            },
        );
    }

    const handleReplaymentIndex = async (
        index: number,
    ) => {
        if (!replayment || !activeTab) {
            return;
        }

        await sendMessage<ReplaymentIndexMessage>(
            {
                type: MESSAGE_TYPE.REPLAYMENT_INDEX,
                data: {
                    tabID: activeTab.id,
                    index,
                },
            },
            () => {
            },
        );
    }

    const handleReplaymentPlayPause = async () => {
        if (!replayment || !activeTab) {
            return;
        }

        const messageType = replayment.status === 'playing'
            ? MESSAGE_TYPE.REPLAYMENT_PAUSE
            : MESSAGE_TYPE.REPLAYMENT_PLAY;

        await sendMessage<ReplaymentPlayMessage | ReplaymentPauseMessage>(
            {
                type: messageType,
                data: activeTab.id,
            },
            () => {
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
                <h1>
                    replaying destream
                </h1>

                <PureButton
                    text={replayment.status === 'playing' ? 'Pause' : 'Play'}
                    atClick={() => {
                        handleReplaymentPlayPause();
                    }}
                    theme={plurid}
                    level={2}
                    style={buttonStyle}
                />

                <div
                    style={{
                        margin: '2rem 0',
                    }}
                >
                    <Slider
                        value={replayment.currentIndex}
                        atChange={(
                            index,
                        ) => {
                            handleReplaymentIndex(index);
                        }}
                        min={0}
                        max={replayment.data.events.length - 1}
                        step={1}
                        theme={plurid}
                        width={280}
                        level={2}
                    />
                </div>

                <LinkButton
                    text="cancel"
                    atClick={() => {
                        stopReplayment();
                    }}
                    theme={plurid}
                    style={{
                        margin: '1rem 0',
                    }}
                />
            </StyledPopup>
        )
    }

    return (
        <StyledPopup>
            <h1>
                <a
                    href={DESTREAM_WWW_URL}
                    target="_blank"
                >
                    destream
                </a>
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
