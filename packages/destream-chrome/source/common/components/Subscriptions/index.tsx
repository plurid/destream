// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
        useCallback,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        InputLine,
        EntityPillGroup,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MessageStartSubscription,
        MessageStopSubscriptions,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
        storageFields,
    } from '~data/constants';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        storageGet,
        storageSetMultiple,
        storageAddListener,
        storageRemoveListener,
    } from '~common/storage';
    // #endregion external


    // #region internal
    import {
        StyledSubscriptions,
    } from './styled';
    // #endregion internal
// #region imports



// #region module
export interface SubscriptionsProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        width?: number;
        // #endregion values

        // #region methods
        removeSubscription?: (name: string) => void;
        // #endregion methods
    // #endregion optional
}

const Subscriptions: React.FC<SubscriptionsProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            width,
            // #endregion values

            // #region methods
            removeSubscription,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region state
    const [
        newSubscription,
        setNewSubscription,
    ] = useState('');

    const [
        subscriptions,
        setSubscriptions,
    ] = useState<string[]>([]);
    // #endregion state


    // #region handlers
    const getSubscriptions = useCallback(async () => {
        const result = await storageGet([storageFields.subscriptions]);
        if (!result.subscriptions) {
            return;
        }

        setSubscriptions(result.subscriptions);
    }, []);

    const startSubscription = async (
        name: string,
    ) => {
        sendMessage<MessageStartSubscription, ResponseMessage>(
            {
                type: MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.START_SUBSCRIPTION,
                data: name,
            },
            (_response) => {
            },
        );
    }

    const stopSubscription = async (
        name: string,
    ) => {
        if (removeSubscription) {
            removeSubscription(name);
        }

        sendMessage<MessageStopSubscriptions, ResponseMessage>(
            {
                type: MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_SUBSCRIPTIONS,
                data: name,
            },
            (_response) => {
            },
        );
    }

    const handleNewSubscription = () => {
        let newSubscriptionValue = newSubscription.trim();
        if (!newSubscriptionValue) {
            return;
        }

        const alreadySubscribed = !!subscriptions.find(subscription => subscription === newSubscriptionValue);
        if (alreadySubscribed) {
            setNewSubscription('');
            return;
        }

        startSubscription(newSubscriptionValue);

        setSubscriptions([
            ...subscriptions,
            newSubscriptionValue,
        ]);
        setNewSubscription('');
    }

    const handleStopSubscription = (
        name: string,
    ) => {
        stopSubscription(name);

        setSubscriptions(subscriptions.filter(subscription => subscription !== name));
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        getSubscriptions();
    }, []);

    useEffect(() => {
        const setSubscriptions = async () => {
            await storageSetMultiple({ subscriptions });

            storageAddListener(getSubscriptions);
        }

        setSubscriptions();

        return () => {
            storageRemoveListener(getSubscriptions);
        }
    }, [
        JSON.stringify(subscriptions),
    ]);
    // #endregion effects


    // #region render
    const inputWidth = width ? width + 'px' : '324px';

    return (
        <StyledSubscriptions
            theme={theme}
        >
            <InputLine
                name="subscribe to streamer"
                text={newSubscription}
                atChange={(event) => {
                    setNewSubscription(event.target.value);
                }}
                textline={{
                    enterAtClick: () => {
                        handleNewSubscription();
                    },
                }}
                theme={theme}
                style={{
                    width: inputWidth,
                }}
            />

            {subscriptions.length === 0 && (
                <div
                    style={{
                        display: 'grid',
                        placeContent: 'center',
                        margin: '2rem 0',
                    }}
                >
                    no subscriptions
                </div>
            )}

            {subscriptions.length > 0 && (
                <EntityPillGroup
                    entities={subscriptions}
                    theme={theme}
                    remove={(entity) => {
                        handleStopSubscription(entity);
                    }}
                    style={{
                        marginTop: '1rem',
                        wordBreak: 'break-all',
                    }}
                />
            )}
        </StyledSubscriptions>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Subscriptions;
// #endregion exports
