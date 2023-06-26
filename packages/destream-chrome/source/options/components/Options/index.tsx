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
        // DEFAULT_API_ENDPOINT,
        MESSAGE_OPTIONS_TO_BACKGROUND,
        defaultPermissions,
        // defaultAllowedURLOrigins,
        storageFields,
    } from '~data/constants';

    import {
        MessageStopEverything,
        GeneralPermissions,
    } from '~data/interfaces';

    import {
        storageGetAll,
        storageGet,
        storageSet,
        storageClearAll,
    } from '~common/storage';

    import {
        checkEverythingKey,
    } from '~common/logic';

    import {
        sendMessage,
    } from '~common/messaging';

    import Login from '~common/components/Login';
    import Subscriptions from '~common/components/Subscriptions';

    import {
        useLoggedIn,
        useIsStreamer,
    } from '~common/hooks';

    import {
        logout,
    } from '~common/logic';
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
    _properties,
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
        useNotifications,
        setUseNotifications,
    ] = useState(defaultPermissions.useNotifications);

    const [
        useSessionGroups,
        setUseSessionGroups,
    ] = useState(defaultPermissions.useSessionGroups);

    const [
        autoCheckLinkages,
        setAutoCheckLinkages,
    ] = useState(defaultPermissions.autoCheckLinkages);

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
    ] = useState(defaultPermissions.allowChangeURLAnyOrigin);

    const [
        newAllowedURLOrigin,
        setNewAllowedURLOrigin,
    ] = useState('');

    const [
        allowedURLOrigins,
        setAllowedURLOrigins,
    ] = useState([
        ...defaultPermissions.allowedURLOrigins,
    ]);

    // const [
    //     newEndpoint,
    //     setNewEndpoint,
    // ] = useState('');

    // const [
    //     endpoints,
    //     setEndpoints,
    // ] = useState([
    //     DEFAULT_API_ENDPOINT,
    // ]);

    const [
        showStopEverything,
        setShowStopEverything,
    ] = useState(false);

    const [
        showResetEverything,
        setShowResetEverything,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const registerAsStreamer = () => {
        window.open(STREAMER_REGISTRATION_URL, '_blank');
    }

    const resetEverything = async () => {
        setShowResetEverything(false);

        await stopEverything();
        await logout();
        await storageClearAll();
    }

    const stopEverything = async () => {
        setShowStopEverything(false);

        await sendMessage<MessageStopEverything>({
            type: MESSAGE_OPTIONS_TO_BACKGROUND.STOP_EVERYTHING,
        });
    }
    // #endregion handlers


    // #region effects
    /** Get General Permissions */
    useEffect(() => {
        const getPermissions = async () => {
            const generalPermissions = await storageGet(storageFields.generalPermissions);
            if (!generalPermissions) {
                return;
            }

            const {
                useNotifications,
                useSessionGroups,
                autoCheckLinkages,
                allowScroll,
                allowPlayPause,
                allowTimeSeek,
                allowVolumeControl,
                allowRateControl,
                allowLike,
                allowChangeURL,
                allowChangeURLAnyOrigin,
                allowedURLOrigins,
            } = generalPermissions;

            setUseNotifications(useNotifications);
            setUseSessionGroups(useSessionGroups);
            setAutoCheckLinkages(autoCheckLinkages);
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
            const extendedDrawers = await storageGet(storageFields.extendedDrawers);
            if (!extendedDrawers) {
                return;
            }

            setExtendedDrawers({
                ...extendedDrawers,
            });
        }

        getPermissions();
        getExtendedDrawers();
    }, []);

    /** Set General Permissions */
    useEffect(() => {
        const setPermissions = async () => {
            const generalPermissions: GeneralPermissions = {
                useNotifications,
                useSessionGroups,
                autoCheckLinkages,
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

            await storageSet(
                storageFields.generalPermissions,
                generalPermissions,
            );
        }

        setPermissions();
    }, [
        useNotifications,
        useSessionGroups,
        autoCheckLinkages,
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

    /** Extended Drawers */
    useEffect(() => {
        const setExtendedDrawers = async () => {
            await storageSet(storageFields.extendedDrawers, extendedDrawers);
        }

        setExtendedDrawers();
    }, [
        JSON.stringify(extendedDrawers),
    ]);

    /** Show Stop Everything */
    useEffect(() => {
        const checkShowEverything = async () => {
            try {
                const storage = await storageGetAll();
                const showEverything = Object
                    .keys(storage)
                    .some(checkEverythingKey);

                setShowStopEverything(showEverything);
            } catch (error) {
                return;
            }
        }

        checkShowEverything();
    }, []);
    // #endregion effects


    // #region render
    if (showResetEverything) {
        return (
            <StyledOptions>
                <PureButton
                    text="Reset Everything"
                    atClick={() => {
                        resetEverything();
                    }}
                    theme={plurid}
                    level={2}
                    style={{
                        width: '320px',
                        margin: '0 auto',
                    }}
                />

                <LinkButton
                    text="cancel"
                    atClick={() => {
                        setShowResetEverything(false);
                    }}
                    theme={plurid}
                    inline={true}
                />
            </StyledOptions>
        );
    }

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
                        width: '320px',
                        margin: '0 auto',
                        wordBreak: 'break-all',
                    }}
                />
            )}


            {!isStreamer && (
                <div>
                    <LinkButton
                        text="register as streamer"
                        atClick={() => {
                            registerAsStreamer();
                        }}
                        theme={plurid}
                        inline={true}
                    />
                </div>
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
                style={{
                    width: '320px',
                }}
            >
                <InputSwitch
                    name="use notifications"
                    checked={useNotifications}
                    atChange={() => {
                        setUseNotifications(!useNotifications);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="use session groups"
                    checked={useSessionGroups}
                    atChange={() => {
                        setUseSessionGroups(!useSessionGroups);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="auto-check linkages"
                    checked={autoCheckLinkages}
                    atChange={() => {
                        setAutoCheckLinkages(!autoCheckLinkages);
                    }}
                    theme={plurid}
                />

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

            {/* <Drawer
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
            </Drawer> */}


            {showStopEverything && (
                <PureButton
                    text="Stop Everything"
                    atClick={() => {
                        stopEverything();
                    }}
                    theme={plurid}
                    level={2}
                    style={{
                        width: '320px',
                        margin: '0 auto',
                    }}
                />
            )}

            <LinkButton
                text="reset everything"
                atClick={() => {
                    setShowResetEverything(true);
                }}
                theme={plurid}
                inline={true}
                style={{
                    marginTop: '2rem',
                }}
            />
        </StyledOptions>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Options;
// #endregion exports
