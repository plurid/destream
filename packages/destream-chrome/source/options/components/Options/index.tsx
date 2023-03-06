// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        InputSwitch,
        EntityPillGroup,
    } from '@plurid/plurid-ui-components-react';
    // #endregion libraries


    // #region internal
    import {
        StyledOptions,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
const Options: React.FC<any> = (
    properties,
) => {
    // #region state
    const [
        allowPlayPause,
        setAllowPlayPause,
    ] = useState(true);

    const [
        allowTimeSkip,
        setAllowTimeSkip,
    ] = useState(true);

    const [
        allowVolumeControl,
        setAllowVolumeControl,
    ] = useState(true);

    const [
        allowLike,
        setAllowLike,
    ] = useState(true);

    const [
        allowChangeURL,
        setAllowChangeURL,
    ] = useState(false);

    const [
        allowChangeURLAnyOrigin,
        setAllowChangeURLAnyOrigin,
    ] = useState(false);

    const [
        allowedURLOrigins,
        setAllowedURLOrigins,
    ] = useState([]);
    // #endregion state


    // #region render
    return (
        <StyledOptions>
            <div>
                <h1>
                    general permissions
                </h1>

                <InputSwitch
                    name="allow play/pause audio/video"
                    checked={allowPlayPause}
                    atChange={() => {
                        setAllowPlayPause(!allowPlayPause);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="allow time skip audio/video"
                    checked={allowTimeSkip}
                    atChange={() => {
                        setAllowTimeSkip(!allowTimeSkip);
                    }}
                    theme={plurid}
                />

                <InputSwitch
                    name="allow volume control audio/video"
                    checked={allowVolumeControl}
                    atChange={() => {
                        setAllowVolumeControl(!allowVolumeControl);
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
                                change URL for origins

                                <EntityPillGroup
                                    entities={allowedURLOrigins}
                                    theme={plurid}
                                    remove={(entity) => {
                                        setAllowedURLOrigins(allowedURLOrigins.filter(e => e !== entity));
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </StyledOptions>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Options;
// #endregion exports
