// #region imports
    // #region libraries
    import React from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        LinkButton,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries
// #region imports



// #region module
export interface ReplayDestreamProperties {
    setShowReplayDestream: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReplayDestream: React.FC<ReplayDestreamProperties> = (
    properties,
) => {
    // #region properties
    const {
        setShowReplayDestream,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <LinkButton
            text="replay destream"
            atClick={() => {
                setShowReplayDestream(true);
            }}
            theme={plurid}
            inline={true}
        />
    );
    // #endregion render
}
// #endregion module



// #region exports
export default ReplayDestream;
// #endregion exports
