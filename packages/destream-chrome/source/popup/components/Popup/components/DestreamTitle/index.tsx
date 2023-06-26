// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import {
        DESTREAM_WWW_URL,
    } from '~data/constants';
    // #endregion external
// #region imports



// #region module
export interface DestreamTitleProperties {
}

const DestreamTitle: React.FC<DestreamTitleProperties> = (
    _properties,
) => {
    // #region render
    return (
        <h1>
            <a
                href={DESTREAM_WWW_URL}
                target="_blank"
            >
                destream
            </a>
        </h1>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default DestreamTitle;
// #endregion exports
