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
        LinkButton,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import Login from '../../../common/components/Login'
    // #endregion external


    // #region internal
    import {
        StyledPopup,
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
    ] = useState(false);

    const [
        activeTab,
        setActiveTab,
    ] = useState<chrome.tabs.Tab | null>(null);

    const [
        activeTabControlledBy,
        setActiveTabControlledBy,
    ] = useState('');
    // #endregion state


    // #region handlers
    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const getTab = async () => {
            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
            setActiveTab(tab);
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
                />
            )}

            {loggedIn
            && activeTab
            && activeTabControlledBy
            && (
                <div>
                    <div>
                        {activeTab.url} controlled by {activeTabControlledBy}
                    </div>

                    <div>
                        Stop Control
                    </div>
                </div>
            )}

            {loggedIn
            && activeTab
            && !activeTabControlledBy
            && (
                <div>
                    <div>
                        {activeTab.url} not controlled
                    </div>
                </div>
            )}

            {loggedIn
            && !activeTab
            && (
                <div>
                    select a web page
                </div>
            )}

            <LinkButton
                text="options"
                atClick={() => {
                    openOptions();
                }}
                theme={plurid}
            />
        </StyledPopup>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Popup;
// #endregion exports
