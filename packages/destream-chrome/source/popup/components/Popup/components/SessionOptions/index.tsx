// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        LinkButton,
        InputSwitch,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_TYPE,
    } from '../../../../../data';

    import {
        sendMessage,
    } from '../../../../../common/messaging';
    // #endregion external
// #region imports



// #region module
export interface SessionOptionsProperties {
    activeTab: chrome.tabs.Tab | undefined;
    activeTabControlledBy: string | undefined;
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
        showStream,
        setShowStream,
        showStreamChat,
        setShowStreamChat,
    } = properties;
    // #endregion properties


    // #region state
    const [
        resyncingSession,
        setResyncingSession,
    ] = useState(false);
    // #endregion state


    // #region handlers
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
