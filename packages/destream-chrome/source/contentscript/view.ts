// #region imports
    // #region internal
    import {
        checkYoutubeOrigin,
    } from './utilities/youtube';
    // #endregion internal
// #endregion imports



// #region module
export const injectView = () => {
    if (!checkYoutubeOrigin()) return;

    const view = document.createElement('div');
    view.id = 'destream-view';
    document.body.appendChild(view);

    view.style.position = 'absolute';
    view.style.top = '0';
    view.style.left = '0';
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.zIndex = '99999';
    view.style.pointerEvents = 'none';


    const twitchChannelName = '';


    const streamIframe = document.createElement('iframe');
    streamIframe.id = 'destream-stream-iframe';
    view.appendChild(streamIframe);
    streamIframe.src = `https://www.twitch.tv/embed/${twitchChannelName}/chat?parent=www.youtube.com`;

    const chatIframe = document.createElement('iframe');
    chatIframe.id = 'destream-chat-iframe';
    view.appendChild(chatIframe);
    chatIframe.src = `https://player.twitch.tv/?channel=${twitchChannelName}&parent=www.youtube.com`;
}
// #endregion module
