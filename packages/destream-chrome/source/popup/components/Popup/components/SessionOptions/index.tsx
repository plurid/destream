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
        InputSwitch,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        Session,
    } from '~data/interfaces';

    import {
        Tab,
    } from '~common/types';

    import {
        getTabSettingsID,
        getTabSettings,
    } from '~background/utilities';

    import {
        storageUpdate,
    } from '~common/storage';
    // #endregion external
// #region imports



// #region module
export interface SubscriptionOptionsProperties {
    activeTab: Tab | undefined;
    session: Session;
}

const SubscriptionOptions: React.FC<SubscriptionOptionsProperties> = (
    properties,
) => {
    // #region properties
    const {
        activeTab,
        session,
    } = properties;
    // #endregion properties


    // #region state
    const [
        streamCursor,
        setStreamCursor,
    ] = useState(false);
    // #endregion state


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

            setStreamCursor(tabSettings.streamCursor);
        }

        loadTabSettings();
    }, [
        activeTab,
    ]);

    /** setTabSettings */
    useEffect(() => {
        if (!activeTab || !session) {
            return;
        }

        const setTabSettings = async () => {
            const id = getTabSettingsID(activeTab.id);
            await storageUpdate(
                id,
                {
                    streamCursor,
                },
            );
        }

        setTabSettings();
    }, [
        activeTab,
        streamCursor,
    ]);
    // #endregion effects


    // #region render
    if (!session) {
        return (<></>);
    }

    return (
        <div>
            <InputSwitch
                name="stream cursor"
                checked={streamCursor}
                atChange={() => {
                    setStreamCursor(value => !value);
                }}
                theme={plurid}
            />
        </div>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default SubscriptionOptions;
// #endregion exports
