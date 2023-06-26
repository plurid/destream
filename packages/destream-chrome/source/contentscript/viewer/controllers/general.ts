// #region imports
    // #region external
    import {
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MessageURLChange,
        ResponseMessage,
    } from '~data/index';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        log,
    } from '~common/utilities';

    import {
        DESTREAM_CURSOR_ID,
        CURSOR_HIDE,
    } from '~contentscript/data';

    import {
        getGeneralVideoPlayer,
    } from '~contentscript/utilities/general';
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


export const generateCursor = (
    streamerName: string,
) => {
    const cursor = document.createElement('div');
    cursor.id = DESTREAM_CURSOR_ID;

    cursor.style.cssText = `
        display: none;
        pointer-events: none;
        user-select: none;
        z-index: 99999999;
        position: absolute;
        left: -1000px;
        top: -1000px;
        color: white;
        font-family: Ubuntu, -apple-system, Roboto, sans-serif;
        font-size: 10px;
        text-align: center;
        display: grid;
        gap: 0.5rem;
        place-content: center;
        justify-items: center;
    `;

    cursor.insertAdjacentHTML(
        'beforeend',
        `<svg xmlns="http://www.w3.org/2000/svg" style="width: 25px;" viewBox="0 0 500 500"><defs><style>.cls-1{fill:#fff;}.cls-2{fill:#000;}</style></defs><polygon class="cls-1" points="468.52 222.46 31.48 18.81 161.27 481.19 468.52 222.46"/><polygon class="cls-2" points="156.84 195.79 293.17 350.51 221.67 410.72 156.84 195.79"/><path class="cls-2" d="M191.06,257.32l80.72,91.6-42.34,35.64L191.06,257.32M122.61,134.26l91.28,302.62L314.57,352.1l-192-217.84Z"/><polygon class="cls-2" points="182.64 463.19 70.95 65.27 447.06 240.53 468.52 222.46 31.48 18.81 161.27 481.19 182.64 463.19"/></svg>`,
    );

    if (streamerName) {
        cursor.insertAdjacentHTML(
            'beforeend',
            `<div>${streamerName}</div>`,
        );
    }

    document.body.appendChild(cursor);
}

export const destroyCursor = () => {
    const cursor = document.getElementById(DESTREAM_CURSOR_ID);
    if (!cursor) {
        return;
    }

    cursor.remove();
}

let cursorTimeout: NodeJS.Timeout | undefined;

export const generalCursorTo = (
    x: number,
    y: number,
) => {
    const cursor = document.getElementById(DESTREAM_CURSOR_ID);
    if (!cursor) {
        return;
    }

    const left = x / 100 * window.innerWidth;
    const top = y / 100 * window.innerHeight;

    cursor.style.display = 'grid';
    cursor.style.left = left + 'px';
    cursor.style.top = top + 'px';

    if (cursorTimeout) {
        clearTimeout(cursorTimeout);
    }
    cursorTimeout = setTimeout(() => {
        cursor.style.display = 'none';
    }, CURSOR_HIDE);
}


export const generalURLChange = (
    url: string,
) => {
    sendMessage<MessageURLChange, ResponseMessage>(
        {
            type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.URL_CHANGE,
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



export const generalVideoPlay = () => {
    try {
        const videoPlayer = getGeneralVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.play()
            .catch(error => log(error));
    } catch (error) {
        log(error);
    }
}

export const generalVideoPause = () => {
    try {
        const videoPlayer = getGeneralVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.pause();
    } catch (error) {
        log(error);
    }
}

export const generalVideoSeek = (
    seconds: number,
) => {
    try {
        const videoPlayer = getGeneralVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.currentTime = seconds;
    } catch (error) {
        log(error);
    }
}

export const generalVideoVolumeChange = (
    volume: number,
) => {
    try {
        const videoPlayer = getGeneralVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.volume = volume;
    } catch (error) {
        log(error);
    }
}

export const generalVideoRateChange = (
    rate: number,
) => {
    try {
        const videoPlayer = getGeneralVideoPlayer();
        if (!videoPlayer) {
            return;
        }

        videoPlayer.playbackRate = rate;
    } catch (error) {
        log(error);
    }
}
// #endregion module
