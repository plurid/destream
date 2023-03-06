import * as React from 'react';

import {
    StyledPopup,
} from './styled';



const Popup: React.FC<any> = (properties) => {
    // const openOptions = () => {
    //     chrome.runtime.openOptionsPage();
    // }

    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {
    //         console.log(request);

    //         console.log(sender.tab ?
    //                     "from a content script:" + sender.tab.url :
    //                     "from the extension");
    //         if (request.greeting == "hello") {
    //             sendResponse({farewell: "goodbye"});
    //         }
    //     }
    // );

    return (
        <StyledPopup>

        </StyledPopup>
    );
}


export default Popup;
