import * as React from 'react';

import {
    StyledOptions,
} from './styled';



const Options: React.FC<any> = (properties) => {
    return (
        <StyledOptions>
            allow play/pause audio/video

            allow mute audio/video

            allow like

            allow change URL

            change URL for origins (all or specific)

        </StyledOptions>
    );
}


export default Options;
