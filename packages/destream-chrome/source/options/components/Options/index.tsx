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
    import {
        DEFAULT_PUBLISH_ENDPOINT,
    } from '../../../data/constants';

    import Login from '../../../common/components/Login';

    import {
        useLoggedIn,
        useIsStreamer,
    } from '../../../common/hooks';

    import {
        logout,
    } from '../../../common/logic';
    // #endregion external


    // #region internal
    import {
        StyledOptions,
        StyledSpacer,
    } from './styled';

    import Drawer from './components/Drawer';
    // #endregion internal
// #endregion imports



// #region module
const Options: React.FC<any> = (
    properties,
) => {
    // #region state
    const [
        extendedDrawers,
        setExtendedDrawers,
    ] = useState({
        generalPermissions: true,
        subscriptions: true,
        endpoints: true,
    });

    const [
        loggedIn,
        setLoggedIn,
    ] = useLoggedIn();

    const [
        isStreamer,
    ] = useIsStreamer();

    const [
        allowScroll,
        setAllowScroll,
    ] = useState(true);

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

    const [
        newEndpoint,
        setNewEndpoint,
    ] = useState('');

    const [
        endpoints,
        setEndpoints,
    ] = useState([
        DEFAULT_PUBLISH_ENDPOINT,
    ]);
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
                allowScroll,
                allowPlayPause,
                allowTimeSkip,
                allowVolumeControl,
                allowLike,
                allowChangeURL,
                allowChangeURLAnyOrigin,
                allowedURLOrigins,
            } = result.generalPermissions;

            setAllowScroll(allowScroll);
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

        const getExtendedDrawers = async () => {
            const result = await chrome.storage.local.get(['extendedDrawers']);
            if (!result.extendedDrawers) {
                return;
            }

            setExtendedDrawers({
                ...result.extendedDrawers,
            });
        }

        getPermissions();
        getSubscriptions();
        getExtendedDrawers();
    }, []);

    useEffect(() => {
        const setPermissions = async () => {
            const generalPermissions = {
                allowScroll,
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
        allowScroll,
        allowPlayPause,
        allowTimeSkip,
        allowVolumeControl,
        allowLike,
        allowChangeURL,
        allowChangeURLAnyOrigin,
        allowedURLOrigins,

        subscriptions,
    ]);

    useEffect(() => {
        const setExtendedDrawers = async () => {
            await chrome.storage.local.set({ extendedDrawers });
        }

        setExtendedDrawers();
    }, [
        JSON.stringify(extendedDrawers),
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
                    logout();
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

            <Drawer
                title="general permissions"
                theme={plurid}
                extended={extendedDrawers.generalPermissions}
                onExtend={(extended) => {
                    setExtendedDrawers({
                        ...extendedDrawers,
                        generalPermissions: extended,
                    });
                }}
            >
                <InputSwitch
                    name="allow scroll"
                    checked={allowScroll}
                    atChange={() => {
                        setAllowScroll(!allowScroll);
                    }}
                    theme={plurid}
                />

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
            </Drawer>

            <StyledSpacer />

            <Drawer
                title="subscriptions"
                theme={plurid}
                extended={extendedDrawers.subscriptions}
                onExtend={(extended) => {
                    setExtendedDrawers({
                        ...extendedDrawers,
                        subscriptions: extended,
                    });
                }}
            >
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
            </Drawer>

            <StyledSpacer />

            <Drawer
                title="endpoints"
                theme={plurid}
                extended={extendedDrawers.endpoints}
                onExtend={(extended) => {
                    setExtendedDrawers({
                        ...extendedDrawers,
                        endpoints: extended,
                    });
                }}
            >
                <InputLine
                    name="new endpoint"
                    text={newEndpoint}
                    atChange={(event) => {
                        setNewEndpoint(event.target.value);
                    }}
                    textline={{
                        enterAtClick: () => {
                            setEndpoints([
                                ...endpoints,
                                newEndpoint,
                            ]);
                            setNewEndpoint('');
                        },
                    }}
                    theme={plurid}
                    style={{
                        width: '324px',
                    }}
                />

                {endpoints.length > 0 && (
                    <EntityPillGroup
                        entities={endpoints}
                        theme={plurid}
                        remove={(entity) => {
                            if (entity === DEFAULT_PUBLISH_ENDPOINT) {
                                return;
                            }

                            setEndpoints(endpoints.filter(e => e !== entity));
                        }}
                        style={{
                            marginTop: '1rem',
                        }}
                    />
                )}
            </Drawer>
        </StyledOptions>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Options;
// #endregion exports
