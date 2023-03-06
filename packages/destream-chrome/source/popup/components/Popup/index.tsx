import * as React from 'react';

import {
    plurid,
} from '@plurid/plurid-themes';

import {
    LinkButton,
} from '@plurid/plurid-ui-components-react';

import Login from '../../../common/components/Login'

import {
    StyledPopup,
} from './styled';



const Popup: React.FC<any> = (
    properties,
) => {
    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    }


    return (
        <StyledPopup>
            <h1>
                destream
            </h1>

            <Login
                theme={plurid}
            />

            <LinkButton
                text="options"
                atClick={() => {
                    openOptions();
                }}
                theme={plurid}
            />
        </StyledPopup>
    );
}


export default Popup;
