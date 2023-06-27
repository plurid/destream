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
        PluridIconPlay,
        PluridIconPause,
    } from '@plurid/plurid-icons-react';

    import {
        useThrottledCallback,
    } from '@plurid/plurid-functions-react';

    import {
        LinkButton,
        RefreshButton,
        Spinner,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        Linkage,
        LinkageOfURL,
    } from '~data/index';

    import {
        storageSet,
    } from '~common/storage';

    import {
        Tab,
    } from '~common/types';

    import {
        getLinkageStorageID,
        getLinkagesOfURL,
        getLinkage,
        storeURLLinkages,
        getURLLinkages,
        getLinkageByTabID,
    } from '~background/linkages';

    import {
        getGeneralPermissions,
    } from '~background/utilities';
    // #endregion external
// #region imports



// #region module
export interface LinkagesProperties {
    activeTab: Tab | undefined;
}

const Linkages: React.FC<LinkagesProperties> = (
    properties,
) => {
    // #region properties
    const {
        activeTab,
    } = properties;
    // #endregion properties


    // #region state
    const [
        linkages,
        setLinkages,
    ] = useState<LinkageOfURL[]>([]);

    const [
        playingLinkage,
        setPlayingLinkage,
    ] = useState('');

    const [
        loading,
        setLoading,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const getLinkages = useThrottledCallback(async () => {
        if (!activeTab || !activeTab.url) {
            return;
        }

        try {
            const linkages = await getLinkagesOfURL(
                activeTab.url,
            );
            setLinkages(linkages);
            setLoading(false);

            storeURLLinkages(
                activeTab.url,
                linkages,
            );
        } catch (error) {
            setLoading(false);

            return;
        }
    }, 2_000);

    const loadLinkages = () => {
        setLoading(true);
        getLinkages();
    }

    const pauseLinkage = async () => {
        setPlayingLinkage('');
    }

    const playLinkage = async (
        id: string,
    ) => {
        if (!activeTab || !activeTab.id) {
            return;
        }

        try {
            const linkage = await getLinkage(
                id,
            );
            if (!linkage) {
                return;
            }

            const storageID = getLinkageStorageID(activeTab.id);
            await storageSet<Linkage>(storageID, {
                ...linkage,
                tabID: activeTab.id,
                sessionTabs: {},
                endedSessions: 0,
            });

            setPlayingLinkage(id);
        } catch (error) {
            return;
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (!activeTab) {
            return;
        }

        const checkPlayingLinkage = async () => {
            const linkage = await getLinkageByTabID(activeTab.id);
            if (!linkage) {
                return;
            }

            setPlayingLinkage(linkage.id);
        }

        const preCheckLinkages = async () => {
            const urlLinkages = await getURLLinkages(
                activeTab.url,
            );
            if (urlLinkages.length > 0) {
                setLinkages(urlLinkages);
                return;
            }

            const generalPermissions = await getGeneralPermissions();
            if (!generalPermissions) {
                return;
            }

            if (!generalPermissions.autoCheckLinkages) {
                return;
            }

            loadLinkages();
        }

        checkPlayingLinkage();
        preCheckLinkages();
    }, []);
    // #endregion effects


    // #region render
    return (
        <div>
            <div
                style={{
                    display: 'grid',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gridTemplateColumns: '90px 16px',
                    gap: '0.5rem',
                    height: '25px',
                }}
            >
                <LinkButton
                    text="check linkages"
                    atClick={() => {
                        loadLinkages();
                    }}
                    theme={plurid}
                    inline={true}
                />

                {loading ? (
                    <div
                        style={{
                            position: 'relative',
                            height: '16px',
                            width: '16px',
                        }}
                    >
                        <Spinner
                            theme={plurid}
                            size="small"
                        />
                    </div>
                ) : (
                    <RefreshButton
                        atClick={() => {
                            getLinkages();
                        }}
                        theme={plurid}
                    />
                )}
            </div>

            {linkages.map(linkage => {
                const {
                    linkageID,
                    linkageName,
                    streamerName,
                } = linkage;

                return (
                    <div
                        key={linkageID}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                        }}
                    >
                        <div>
                            {streamerName}
                        </div>

                        {linkageName ? (
                            <div>
                                {linkageName}
                            </div>
                        ) : (
                            <div />
                        )}

                        {playingLinkage === linkageID ? (
                            <PluridIconPause
                                atClick={() => {
                                    pauseLinkage();
                                }}
                                theme={plurid}
                            />
                        ) : (
                            <PluridIconPlay
                                atClick={() => {
                                    playLinkage(linkageID);
                                }}
                                theme={plurid}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Linkages;
// #endregion exports
