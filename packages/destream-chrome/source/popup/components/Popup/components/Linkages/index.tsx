// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        PluridIconPlay,
    } from '@plurid/plurid-icons-react';

    import {
        LinkButton,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        getLinkagesOfURL,
        getLinkage,
    } from '../../../../../background/linkages';
    // #endregion external
// #region imports



// #region module
export interface LinkageOfURL {
    streamerName: string;
    linkageID: string;
}


export interface LinkagesProperties {
    activeTab: chrome.tabs.Tab | undefined;
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
    // #endregion state


    // #region handlers
    const getLinkages = async () => {
        if (!activeTab || !activeTab.url) {
            return;
        }

        try {
            const linkages = await getLinkagesOfURL(
                activeTab.url,
            );
            setLinkages(linkages);

            // store linkages in local storage
        } catch (error) {
            return;
        }
    }

    const playLinkage = async (
        id: string,
    ) => {
        try {
            const linkage = await getLinkage(
                id,
            );

            // set linkage as playing
        } catch (error) {
            return;
        }
    }
    // #endregion handlers


    // #region render
    return (
        <div>
            <LinkButton
                text="get linkages"
                atClick={() => {
                    getLinkages();
                }}
                theme={plurid}
                inline={true}
            />

            {linkages.map(linkage => {
                const {
                    linkageID,
                    streamerName,
                } = linkage;

                return (
                    <div
                        key={linkageID}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'space-between',
                            padding: '1rem',
                        }}
                    >
                        <div>
                            {streamerName}
                        </div>

                        <PluridIconPlay
                            theme={plurid}
                            atClick={() => {
                                playLinkage(linkageID);
                            }}
                        />
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
