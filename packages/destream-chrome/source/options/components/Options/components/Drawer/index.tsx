// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region internal
    import {
        StyledDrawer,
    } from './styled';
    // #endregion internal
// #region imports



// #region module
export interface DrawerProperties {
    // #region required
        // #region values
        theme: Theme;
        title: string;
        children: React.ReactNode;
        extended: boolean;
        // #endregion values

        // #region methods
        onExtend: (extended: boolean) => void;
        // #endregion methods
    // #endregion required
}

const Drawer: React.FC<DrawerProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            title,
            children,
            extended: extendedProperty,
            // #endregion values

            // #region methods
            onExtend,
            // #endregion methods
        // #endregion required
    } = properties;
    // #endregion properties


    // #region state
    const [
        extended,
        setExtended,
    ] = useState(extendedProperty);
    // #endregion state


    // #region effects
    useEffect(() => {
        setExtended(extendedProperty);
    }, [
        extendedProperty,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledDrawer
            theme={theme}
        >
            <h1
                onClick={() => {
                    const newValue = !extended;
                    setExtended(newValue);
                    onExtend(newValue);
                }}
            >
                {title}&nbsp;{extended ? '▼' : '▲'}
            </h1>

            {extended && (
                <>
                    {children}
                </>
            )}
        </StyledDrawer>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Drawer;
// #endregion exports
