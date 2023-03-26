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
        STREAMER_REGISTRATION_URL,
        DEFAULT_API_ENDPOINT,
        defaultPermissions,
        defaultAllowedURLOrigins,
    } from '../../../data/constants';

    import Login from '../../../common/components/Login';
    import Subscriptions from '../../../common/components/Subscriptions';

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
        generalPermissions: false,
        subscriptions: false,
        endpoints: false,
    });

    const [
        loggedIn,
        setLoggedIn,
        identonym,
        setIdentonym,
    ] = useLoggedIn();

    const [
        isStreamer,
    ] = useIsStreamer();

    const [
        allowScroll,
        setAllowScroll,
    ] = useState(defaultPermissions.allowScroll);

    const [
        allowPlayPause,
        setAllowPlayPause,
    ] = useState(defaultPermissions.allowPlayPause);

    const [
        allowTimeSeek,
        setAllowTimeSeek,
    ] = useState(defaultPermissions.allowTimeSeek);

    const [
        allowVolumeControl,
        setAllowVolumeControl,
    ] = useState(defaultPermissions.allowVolumeControl);

    const [
        allowRateControl,
        setAllowRateControl,
    ] = useState(defaultPermissions.allowRateControl);

    const [
        allowLike,
        setAllowLike,
    ] = useState(defaultPermissions.allowLike);

    const [
        allowChangeURL,
        setAllowChangeURL,
    ] = useState(defaultPermissions.allowChangeURL);

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
    ] = useState([
        ...defaultAllowedURLOrigins,
    ]);

    const [
        newEndpoint,
        setNewEndpoint,
    ] = useState('');

    const [
        endpoints,
        setEndpoints,
    ] = useState([
        DEFAULT_API_ENDPOINT,
    ]);
    // #endregion state


    // #region handlers
    const registerAsStreamer = () => {
        chrome.tabs.create({
            url: STREAMER_REGISTRATION_URL,
        });
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
                allowTimeSeek,
                allowVolumeControl,
                allowRateControl,
                allowLike,
                allowChangeURL,
                allowChangeURLAnyOrigin,
                allowedURLOrigins,
            } = result.generalPermissions;

            setAllowScroll(allowScroll);
            setAllowPlayPause(allowPlayPause);
            setAllowTimeSeek(allowTimeSeek);
            setAllowVolumeControl(allowVolumeControl);
            setAllowRateControl(allowRateControl);
            setAllowLike(allowLike);
            setAllowChangeURL(allowChangeURL);
            setAllowChangeURLAnyOrigin(allowChangeURLAnyOrigin);
            setAllowedURLOrigins(allowedURLOrigins);
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
        getExtendedDrawers();
    }, []);

    useEffect(() => {
        const setPermissions = async () => {
            const generalPermissions = {
                allowScroll,
                allowPlayPause,
                allowTimeSeek,
                allowVolumeControl,
                allowRateControl,
                allowLike,
                allowChangeURL,
                allowChangeURLAnyOrigin,
                allowedURLOrigins,
            };

            await chrome.storage.local.set({ generalPermissions });
        }

        setPermissions();
    }, [
        allowScroll,
        allowPlayPause,
        allowTimeSeek,
        allowVolumeControl,
        allowRateControl,
        allowLike,
        allowChangeURL,
        allowChangeURLAnyOrigin,
        allowedURLOrigins,
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
    return (
        <StyledOptions>
            {!loggedIn && (
                <Login
                    theme={plurid}
                    atLogin={(identonym) => {
                        setLoggedIn(true);
                        setIdentonym(identonym);
                    }}
                />
            )}

            {loggedIn && (
                <PureButton
                    text={`Logout ${identonym}`}
                    atClick={() => {
                        setLoggedIn(false);
                        logout();
                    }}
                    theme={plurid}
                    level={2}
                    style={{
                        width: '250px',
                        margin: '0 auto',
                    }}
                />
            )}


            {!isStreamer && (
                <LinkButton
                    text="register as streamer"
                    atClick={() => {
                        registerAsStreamer();
                    }}
                    theme={plurid}
                />
            )}


            <StyledSpacer />


            <Drawer
                title="permissions"
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
                    checked={allowTimeSeek}
                    atChange={() => {
                        setAllowTimeSeek(!allowTimeSeek);
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
                    name="allow playback rate control"
                    checked={allowRateControl}
                    atChange={() => {
                        setAllowRateControl(!allowRateControl);
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
                <Subscriptions
                    theme={plurid}
                />
            </Drawer>

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
                            if (entity === DEFAULT_API_ENDPOINT) {
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
