// #region imports
    // #region libraries
    import React from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        PureButton,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region external
    import {
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
    } from '~data/constants';

    import {
        MessageStopEverything,
    } from '~data/interfaces';

    import {
        storageClearAll,
    } from '~common/storage';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        logout,
    } from '~common/logic';
    // #endregion external
// #region imports



// #region module
export interface ErrorFallbackProperties {
    errorCode?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProperties> = (
    properties,
) => {
    // #region properties
    const {
        errorCode,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <div
            style={{
                width: '100%',
                display: 'grid',
                placeContent: 'center',
                textAlign: 'center',
                gap: '2rem',
            }}
        >
            <div>
                something went very wrong {errorCode ? `(${errorCode})` : ''}
            </div>

            <PureButton
                text="Reset Everything"
                atClick={async () => {
                    await sendMessage<MessageStopEverything>({
                        type: MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.STOP_EVERYTHING,
                    });
                    await logout();
                    await storageClearAll();

                    window.location.reload();
                }}
                theme={plurid}
                level={2}
                style={{
                    width: '320px',
                    margin: '0 auto',
                }}
            />

            <div>
                or reinstall the extension
            </div>
        </div>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default ErrorFallback;
// #endregion exports
