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
        allowMute,
        setAllowMute,
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
                    name="allow mute audio/video"
                    checked={allowMute}
                    atChange={() => {
                        setAllowMute(!allowMute);
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

                <div>
                    change URL for origins (all or specific)
                </div>
            </div>
        </StyledOptions>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Options;
// #endregion exports
