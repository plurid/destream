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
        InputLine,
        EntityPillGroup,
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
        StyledOptions,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
const Options: React.FC<any> = (
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
        allowPlayPause,
        setAllowPlayPause,
    ] = useState(true);

    const [
        allowTimeSkip,
        setAllowTimeSkip,
    ] = useState(true);

    const [
        allowVolumeControl,
        setAllowVolumeControl,
    ] = useState(true);

    const [
        allowLike,
        setAllowLike,
    ] = useState(true);

    const [
        allowChangeURL,
        setAllowChangeURL,
    ] = useState(false);

    const [
        allowChangeURLAnyOrigin,
        setAllowChangeURLAnyOrigin,
    ] = useState(false);

    const [
        newAllowedURLOrigin,
        setNewAllowedURLOrigin,
    ] = useState('');

    const [
        allowedURLOrigins,
        setAllowedURLOrigins,
    ] = useState([]);

    const [
        newSubscription,
        setNewSubscription,
    ] = useState('');

    const [
        subscriptions,
        setSubscriptions,
    ] = useState([]);
    // #endregion state


    // #region handlers
    const registerAsStreamer = () => {
        const url = 'https://destream.plurid.com';

        chrome.tabs.create({url});
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const getPermissions = async () => {
            const result = await chrome.storage.local.get(['generalPermissions']);
            if (!result.generalPermissions) {
                return;
            }

            const {
                allowPlayPause,
                allowTimeSkip,
                allowVolumeControl,
                allowLike,
                allowChangeURL,
                allowChangeURLAnyOrigin,
                allowedURLOrigins,
            } = result.generalPermissions;

            setAllowPlayPause(allowPlayPause);
            setAllowTimeSkip(allowTimeSkip);
            setAllowVolumeControl(allowVolumeControl);
            setAllowLike(allowLike);
            setAllowChangeURL(allowChangeURL);
            setAllowChangeURLAnyOrigin(allowChangeURLAnyOrigin);
            setAllowedURLOrigins(allowedURLOrigins);
        }

        const getSubscriptions = async () => {
            const result = await chrome.storage.local.get(['subscriptions']);
            if (!result.subscriptions) {
                return;
            }

            setSubscriptions(result.subscriptions);
        }

        getPermissions();
        getSubscriptions();
    }, []);

    useEffect(() => {
        const setPermissions = async () => {
            const generalPermissions = {
                allowPlayPause,
                allowTimeSkip,
                allowVolumeControl,
                allowLike,
                allowChangeURL,
                allowChangeURLAnyOrigin,
                allowedURLOrigins,
            };

            await chrome.storage.local.set({ generalPermissions });
        }

        const setSubscriptions = async () => {
            await chrome.storage.local.set({ subscriptions });
        }

        setPermissions();
        setSubscriptions();
    }, [
        allowPlayPause,
        allowTimeSkip,
        allowVolumeControl,
        allowLike,
        allowChangeURL,
        allowChangeURLAnyOrigin,
        allowedURLOrigins,

        subscriptions,
    ]);
    // #endregion effects


    // #region render
    if (!loggedIn) {
        return (
            <Login
                theme={plurid}
                atLogin={() => {
                    setLoggedIn(true);
                }}
            />
        );
    }

    return (
        <StyledOptions>
            <PureButton
                text="Logout"
                atClick={() => {
                    setLoggedIn(false);
                }}
                theme={plurid}
                level={2}
                style={{
                    width: '250px',
                    margin: '0 auto',
                    marginBottom: '3rem',
                }}
            />

            {!isStreamer && (
                <LinkButton
                    text="register as streamer"
                    atClick={() => {
                        registerAsStreamer();
                    }}
                    theme={plurid}
                    style={{
                        margin: '0 auto',
                        marginBottom: '3rem',
                    }}
                />
            )}

            <div
                style={{
                    marginBottom: '4rem',
                }}
            >
                <h1>
                    general permissions
                </h1>

                <InputSwitch
                    name="allow play/pause"
                    checked={allowPlayPause}
                    atChange={() => {
                        setAllowPlayPause(!allowPlayPause);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="allow time seek"
                    checked={allowTimeSkip}
                    atChange={() => {
                        setAllowTimeSkip(!allowTimeSkip);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="allow volume control"
                    checked={allowVolumeControl}
                    atChange={() => {
                        setAllowVolumeControl(!allowVolumeControl);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="allow like/heart/upvote"
                    checked={allowLike}
                    atChange={() => {
                        setAllowLike(!allowLike);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="allow change URL"
                    checked={allowChangeURL}
                    atChange={() => {
                        setAllowChangeURL(!allowChangeURL);
                    }}
                    theme={plurid}
                />

                {allowChangeURL && (
                    <>
                        <InputSwitch
                            name="allow change URL to any origin"
                            checked={allowChangeURLAnyOrigin}
                            atChange={() => {
                                setAllowChangeURLAnyOrigin(!allowChangeURLAnyOrigin);
                            }}
                            theme={plurid}
                        />

                        {!allowChangeURLAnyOrigin && (
                            <div>
                                <div
                                    style={{
                                        marginLeft: '0.9rem',
                                        fontSize: '0.9rem',
                                        marginTop: '2.2rem',
                                    }}
                                >
                                    allowed URL origins
                                </div>

                                <InputLine
                                    name="new allowed origin"
                                    text={newAllowedURLOrigin}
                                    atChange={(event) => {
                                        setNewAllowedURLOrigin(event.target.value);
                                    }}
                                    textline={{
                                        placeholder: 'new allowed origin (e.g. origin.com)',
                                        enterAtClick: () => {
                                            setAllowedURLOrigins([
                                                ...allowedURLOrigins,
                                                newAllowedURLOrigin,
                                            ]);
                                            setNewAllowedURLOrigin('');
                                        },
                                    }}
                                    theme={plurid}
                                    style={{
                                        width: '324px',
                                    }}
                                />

                                {allowedURLOrigins.length > 0 && (
                                    <EntityPillGroup
                                        entities={allowedURLOrigins}
                                        theme={plurid}
                                        remove={(entity) => {
                                            setAllowedURLOrigins(allowedURLOrigins.filter(e => e !== entity));
                                        }}
                                        style={{
                                            marginTop: '1rem',
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div>
                <h1>
                    subscriptions
                </h1>

                <InputLine
                    name="subscribe to"
                    text={newSubscription}
                    atChange={(event) => {
                        setNewSubscription(event.target.value);
                    }}
                    textline={{
                        enterAtClick: () => {
                            setSubscriptions([
                                ...subscriptions,
                                newSubscription,
                            ]);
                            setNewSubscription('');
                        },
                    }}
                    theme={plurid}
                    style={{
                        width: '324px',
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
                        theme={plurid}
                        remove={(entity) => {
                            setSubscriptions(subscriptions.filter(e => e !== entity));
                        }}
                        style={{
                            marginTop: '1rem',
                        }}
                    />
                )}
            </div>
        </StyledOptions>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Options;
// #endregion exports
