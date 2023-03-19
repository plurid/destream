// #region imports
    // #region external
    import {
        checkYoutubeOrigin,
    } from '../utilities/youtube';
    // #endregion external


    // #region internal
    import {
        makeResizable,
        styleView,
        styleStream,
        createIframe,
    } from './utilities';
    // #endregion internal
// #endregion imports



// #region module
export const renderTwitchStream = (
    view: HTMLDivElement,
) => {
    // get based on session
    const twitchChannelName = '';

    const stream = document.createElement('div');
    view.appendChild(stream);
    styleStream(stream);

    const chatIframe = createIframe('chat', stream);
    chatIframe.src = `https://player.twitch.tv/?channel=${twitchChannelName}&parent=www.youtube.com`;

    const streamIframe = createIframe('stream', stream);
    streamIframe.src = `https://www.twitch.tv/embed/${twitchChannelName}/chat?parent=www.youtube.com`;
}


export const injectView = () => {
    if (!checkYoutubeOrigin()) return;


    const view = document.createElement('div');
    view.id = 'destream-view';
    document.body.appendChild(view);
    styleView(view);
    makeResizable(view);

    window.addEventListener('keyup', (event) => {
        const shortcutHideKeyCode = 'KeyD';

        if (event.altKey && event.code === shortcutHideKeyCode) {
            if (view.style.display === 'none') {
                view.style.display = 'block';
            } else {
                view.style.display = 'none';
            }
        }
    });


    renderTwitchStream(view);
}
// #endregion module
