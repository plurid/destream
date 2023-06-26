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
        Subscription,
        MessageResyncSession,
        ResponseMessage,

        resyncTimeout,
        MESSAGE_POPUP_TO_BACKGROUND,
    } from '~data/index';

    import {
        getTabSettingsID,
        getTabSettings,
    } from '~background/utilities';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        storageUpdate,
    } from '~common/storage';

    import {
        Tab,
    } from '~common/types';
    // #endregion external
// #region imports



// #region module
export interface SubscriptionOptionsProperties {
    activeTab: Tab | undefined;
    activeTabControlledBy: string | undefined;
    subscription: Subscription;
}

const SubscriptionOptions: React.FC<SubscriptionOptionsProperties> = (
    properties,
) => {
    // #region properties
    const {
        activeTab,
        activeTabControlledBy,
        subscription,
    } = properties;
    // #endregion properties


    // #region state
    const [
        showEventsList,
        setShowEventsList,
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

        await sendMessage<MessageResyncSession, ResponseMessage>(
            {
                type: MESSAGE_POPUP_TO_BACKGROUND.RESYNC_SESSION,
                data: activeTab.id,
            },
            () => {
            },
        );

        setTimeout(() => {
            setResyncingSession(false);
        }, resyncTimeout);
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

            setShowEventsList(tabSettings.showEventsList);
            setShowStream(tabSettings.showStream);
            setShowStreamChat(tabSettings.showStreamChat);
        }

        loadTabSettings();
    }, [
        activeTab,
    ]);

    /** setTabSettings */
    useEffect(() => {
        if (!activeTab || !subscription) {
            return;
        }

        const setTabSettings = async () => {
            const id = getTabSettingsID(activeTab.id);
            await storageUpdate(
                id,
                {
                    showEventsList,
                    showStream,
                    showStreamChat,
                },
            );
        }

        setTabSettings();
    }, [
        activeTab,
        subscription,
        showEventsList,
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
                name="show events"
                checked={showEventsList}
                atChange={() => {
                    setShowEventsList(value => !value);
                }}
                theme={plurid}
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
export default SubscriptionOptions;
// #endregion exports
