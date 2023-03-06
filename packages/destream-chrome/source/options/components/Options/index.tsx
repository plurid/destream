import * as React from 'react';

import {
    StyledOptions,
} from './styled';



const Options: React.FC<any> = (properties) => {
    return (
        <StyledOptions>
            <div>
                <h1>
                    general permissions
                </h1>

                <div>
                    allow play/pause audio/video
                </div>

                <div>
                    allow mute audio/video
                </div>

                <div>
                    allow like
                </div>

                <div>
                    allow change URL
                </div>

                <div>
                    change URL for origins (all or specific)
                </div>
            </div>
        </StyledOptions>
    );
}


export default Options;
