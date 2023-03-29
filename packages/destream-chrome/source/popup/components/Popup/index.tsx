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
    } from '../../../data/constants';

    import {
        StartSessionMessage,
        StopSessionMessage,
        StopSubscriptionMessage,
    } from '../../../data/interfaces';

    import Login from '../../../common/components/Login';
    import Subscriptions from '../../../common/components/Subscriptions';

    import {
        useLoggedIn,
        useIsStreamer,
    } from '../../../common/hooks';
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
        chrome.runtime.openOptionsPage();
    }

    const stopControl = async () => {
        if (!activeTab) {
            return;
        }

        setActiveTabControlledBy('');

        const streamerName = '';

        await chrome.runtime.sendMessage<StopSubscriptionMessage>({
            type: MESSAGE_TYPE.STOP_SUBSCRIPTION,
            data: streamerName,
        });
    }

    const startSession = async () => {
        if (!activeTab) {
            return;
        }

        await chrome.runtime.sendMessage<StartSessionMessage>({
            type: MESSAGE_TYPE.START_SESSION,
            data: activeTab.url,
        });
    }

    const stopSession = async () => {
        if (!activeTab) {
            return;
        }

        await chrome.runtime.sendMessage<StopSessionMessage>({
            type: MESSAGE_TYPE.STOP_SESSION,
            data: activeTab.url,
        });
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
            const [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });
            setActiveTab(tab);

            if (!tab.url.startsWith('chrome://')) {
                setControllableTab(true);
            }
        }

        getTab();
    }, []);

    useEffect(() => {
        if (!activeTab) {
            return;
        }

        const setSettings = async () => {
            const tabSettings: any = {};
            const id = `tab-settings-${activeTab.id}`;
            tabSettings[id] = {
                showStream,
                showStreamChat,
            };
            await chrome.storage.local.set(tabSettings);
        }

        setSettings();
    }, [
        activeTab,
        showStream,
        showStreamChat,
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

            {loggedIn
            && activeTab
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
                            stopControl();
                        }}
                        theme={plurid}
                        level={2}
                        style={{
                            marginTop: '1rem',
                        }}
                    />
                </StyledTabControl>
            )}

            {loggedIn
            && activeTab
            && !activeTabControlledBy
            && (
                <StyledTabControl>
                    <div>
                        {activeTab.url}
                        <br />
                        is not controlled
                    </div>

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

            {loggedIn
            && !activeTab
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
