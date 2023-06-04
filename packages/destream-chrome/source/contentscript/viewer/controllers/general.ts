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


export const DESTREAM_CURSOR_ID = 'destream__cursor';

export const generateCursor = (
    streamerName: string,
) => {
    const cursor = document.createElement('div');
    cursor.id = DESTREAM_CURSOR_ID;

    cursor.style.position = 'absolute';
    cursor.style.color = 'white';
    cursor.style.fontFamily = 'Ubuntu, -apple-system, Roboto, sans-serif';
    cursor.style.fontSize = '10px';
    cursor.style.left = '-1000px';
    cursor.style.top = '-1000px';
    cursor.style.zIndex = '999999';
    cursor.style.display = 'grid';
    cursor.style.placeContent = 'center';
    cursor.style.justifyItems = 'center';

    cursor.insertAdjacentHTML(
        'beforeend',
        `<svg xmlns="http://www.w3.org/2000/svg" style="width: 25px;" viewBox="0 0 500 500"><defs><style>.cls-1{fill:#fff;}.cls-2{fill:#000;}</style></defs><polygon class="cls-1" points="468.52 222.46 31.48 18.81 161.27 481.19 468.52 222.46"/><polygon class="cls-2" points="156.84 195.79 293.17 350.51 221.67 410.72 156.84 195.79"/><path class="cls-2" d="M191.06,257.32l80.72,91.6-42.34,35.64L191.06,257.32M122.61,134.26l91.28,302.62L314.57,352.1l-192-217.84Z"/><polygon class="cls-2" points="182.64 463.19 70.95 65.27 447.06 240.53 468.52 222.46 31.48 18.81 161.27 481.19 182.64 463.19"/></svg>`,
    );

    cursor.insertAdjacentHTML(
        'beforeend',
        `<div>${streamerName}</div>`,
    );

    document.body.appendChild(cursor);
}

export const destroyCursor = () => {
    const cursor = document.getElementById(DESTREAM_CURSOR_ID);
    if (!cursor) {
        return;
    }

    cursor.remove();
}

export const generalCursorTo = (
    x: number,
    y: number,
) => {
    const cursor = document.getElementById(DESTREAM_CURSOR_ID);
    if (!cursor) {
        return;
    }

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
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
