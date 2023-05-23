// #region imports
    // #region libraries
    import React from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        LinkButton,
        InputSwitch,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries
// #region imports



// #region module
export interface SessionOptionsProperties {
    activeTab: chrome.tabs.Tab | undefined;
    activeTabControlledBy: string | undefined;
    resyncSession: () => Promise<void>;
    resyncingSession: boolean;
    showStream: boolean;
    setShowStream: React.Dispatch<React.SetStateAction<boolean>>;
    showStreamChat: boolean;
    setShowStreamChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const SessionOptions: React.FC<SessionOptionsProperties> = (
    properties,
) => {
    // #region properties
    const {
        activeTab,
        activeTabControlledBy,
        resyncSession,
        resyncingSession,
        showStream,
        setShowStream,
        showStreamChat,
        setShowStreamChat,
    } = properties;
    // #endregion properties


    // #region render
    if (!activeTab || !activeTabControlledBy) {
        return (<></>);
    }

    return (
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
                    setShowStream(value => !value);
                }}
                theme={plurid}
            />

            {showStream && (
                <InputSwitch
                    name="show chat"
                    checked={showStreamChat}
                    atChange={() => {
                        setShowStreamChat(value => !value);
                    }}
                    theme={plurid}
                />
            )}
        </div>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default SessionOptions;
// #endregion exports
