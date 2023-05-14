// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        URLChangeMessage,
    } from '../../../data';

    import {
        sendMessage,
    } from '../../../common/messaging';
    // #endregion external
// #endregion imports



// #region module
export const generalScrollTo = (
    top: number,
    left: number = 0,
) => {
    window.scrollTo({
        top,
        left,
        behavior: 'smooth',
    });
}


export const generalURLChange = (
    url: string,
) => {
    sendMessage<URLChangeMessage>(
        {
            type: MESSAGE_TYPE.URL_CHANGE,
            data: url,
        },
        (response) => {
            if (response.status) {
                // URL might be changed from the background script using notifications
                // or it might allow the contentscript to change the URL itself.
                location.href = url;
            }
        },
    );
}
// #endregion module
