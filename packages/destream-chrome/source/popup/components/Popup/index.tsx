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
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import Login from '../../../common/components/Login';

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
    // #endregion state


    // #region handlers
    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    }

    const stopControl = async () => {
        setActiveTabControlledBy('');
    }

    const startSession = async () => {
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const getTab = async () => {
            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            setActiveTab(tab);

            if (!tab.url.startsWith('chrome://')) {
                setControllableTab(true);
            }
        }

        getTab();
    }, []);
    // #endregion effects


    // #region render
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

            <LinkButton
                text="options"
                atClick={() => {
                    openOptions();
                }}
                theme={plurid}
                style={{
                    marginTop: '3rem',
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
