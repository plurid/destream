// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        InputLine,
        PureButton,
        LinkButton,
        Spinner,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region internal
    import {
        StyledLogin,
    } from './styled';

    import {
        loginLogic
    } from './logic';
    // #endregion internal
// #region imports



// #region module
export interface LoginProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        atLogin: () => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion optional
}

const Login: React.FC<LoginProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            atLogin,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region state
    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState(false);

    const [
        identonym,
        setIdentonym,
    ] = useState('');

    const [
        key,
        setKey,
    ] = useState('');
    // #endregion state


    // #region handlers
    const login = async () => {
        if (!identonym || !key) {
            return;
        }

        setLoading(true);
        const result = await loginLogic(
            identonym,
            key,
        );
        if (result) {
            atLogin();
        }
        setError(!result);
        setLoading(false);
    }

    const generateAccount = () => {
        const newAccountLink = 'https://account.plurid.com';

        window.open(newAccountLink, '_blank');
    }
    // #endregion handlers


    // #region render
    if (loading) {
        return (
            <div
                style={{
                    position: 'relative',
                    height: '280px',
                }}
            >
                <Spinner
                    theme={theme}
                />
            </div>
        );
    }

    return (
        <StyledLogin
            theme={theme}
        >
            <InputLine
                name="identonym"
                text={identonym}
                atChange={(event) => {
                    setIdentonym(event.target.value);
                }}
                theme={theme}
                style={{
                    width: '250px',
                }}
            />

            <InputLine
                name="key"
                text={key}
                type="password"
                atChange={(event) => {
                    setKey(event.target.value);
                }}
                textline={{
                    enterAtClick: () => {
                        login();
                    }
                }}
                theme={theme}
                style={{
                    width: '250px',
                }}
            />

            {error && (
                <div>
                    something went wrong
                </div>
            )}

            <PureButton
                text="Login"
                atClick={() => {
                    login();
                }}
                disabled={!identonym || !key}
                theme={theme}
                style={{
                    width: '250px',
                }}
            />

            <LinkButton
                text="generate account"
                atClick={() => {
                    generateAccount();
                }}
                theme={theme}
                style={{
                    width: '250px',
                }}
            />
        </StyledLogin>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Login;
// #endregion exports
