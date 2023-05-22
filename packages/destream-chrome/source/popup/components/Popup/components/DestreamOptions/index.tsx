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


    // #region external
    import {
        openOptionsPage,
    } from '../../../../../common/utilities';
    // #endregion external
// #region imports



// #region module
export interface DestreamOptionsProperties {
}

const DestreamOptions: React.FC<DestreamOptionsProperties> = (
    _properties,
) => {
    // #region render
    return (
        <LinkButton
            text="options"
            atClick={() => {
                openOptionsPage();
            }}
            theme={plurid}
            style={{
                marginTop: '2rem',
            }}
        />
    );
    // #endregion render
}
// #endregion module



// #region exports
export default DestreamOptions;
// #endregion exports
