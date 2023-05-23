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
        InputSwitch,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_TYPE,
        Session,
        Subscription,
    } from '../../../../../data';

    import {
        getTabSettingsID,
        getTabSettings,
    } from '../../../../../background/utilities';

    import {
        storageSet,
    } from '../../../../../common/storage';

    import {
        sendMessage,
    } from '../../../../../common/messaging';
    // #endregion external
// #region imports



// #region module
export interface SessionOptionsProperties {
    activeTab: chrome.tabs.Tab | undefined;
    activeTabControlledBy: string | undefined;
    session: Session;
    subscription: Subscription;
}

const SessionOptions: React.FC<SessionOptionsProperties> = (
    properties,
) => {
    // #region properties
    const {
        activeTab,
        activeTabControlledBy,
        session,
        subscription,
    } = properties;
    // #endregion properties


    // #region state
    const [
        showStream,
        setShowStream,
    ] = useState(false);

    const [
        showStreamChat,
        setShowStreamChat,
    ] = useState(false);

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
            },
        );

        setTimeout(() => {
            setResyncingSession(false);
        }, 1_000);
    }
    // #endregion handlers


    // #region effects
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

    /** setTabSettings */
    useEffect(() => {
        if (!activeTab) {
            return;
        }
        if (!session && !subscription) {
            return;
        }

        const setTabSettings = async () => {
            const id = getTabSettingsID(activeTab.id);
            await storageSet(
                id,
                {
                    showStream,
                    showStreamChat,
                },
            );
        }

        setTabSettings();
    }, [
        activeTab,
        session,
        subscription,
        showStream,
        showStreamChat,
    ]);
    // #endregion effects


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
