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


    // #region external
    import {
        NEW_ACCOUNT_URL,
    } from '~data/constants';
    // #endregion external


    // #region internal
    import {
        StyledLogin,
    } from './styled';

    import {
        loginLogic,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
export interface LoginProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        atLogin: (
            identonym: string,
        ) => void;
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
        showLoginForm,
        setShowLoginForm,
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
    const handleLogin = async () => {
        if (!identonym || !key) {
            return;
        }

        setLoading(true);
        const result = await loginLogic(
            identonym,
            key,
        );
        if (result) {
            atLogin(identonym);
        }
        setError(!result);
        setLoading(false);
    }

    const handleGenerateAccount = () => {
        window.open(NEW_ACCOUNT_URL, '_blank');
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

    if (!showLoginForm) {
        return (
            <LinkButton
                text="login for extended features"
                atClick={() => {
                    setShowLoginForm(true);
                }}
                theme={theme}
            />
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
                        handleLogin();
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
                    handleLogin();
                }}
                disabled={!identonym || !key}
                theme={theme}
                level={2}
                style={{
                    width: '250px',
                }}
            />

            <div>
                <LinkButton
                    text="generate account"
                    atClick={() => {
                        handleGenerateAccount();
                    }}
                    theme={theme}
                    style={{
                        marginTop: '0.5rem',
                    }}
                    inline={true}
                />
            </div>
        </StyledLogin>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Login;
// #endregion exports
