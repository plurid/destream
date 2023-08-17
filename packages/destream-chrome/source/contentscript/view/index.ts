// #region imports
    // #region external
    import {
        Session,
        Subscription,
        TabSettings,
    } from '~data/interfaces';

    import {
        storageAddListener,
    } from '~common/storage';

    import {
        getTabID,
        getSession,
        getSubscription,
        getTabSettings,
    } from '../messaging';

    import {
        DESTREAM_VIEW_ID,
        DESTREAM_VIEW_STREAM_ID,
    } from '../data';
    // #endregion external


    // #region internal
    import {
        makeResizable,
        styleView,
        styleSplitStream,
        styleFullStream,
        composeIframeID,
        createIframe,
    } from './utilities';
    // #endregion internal
// #endregion imports



// #region module
export const resolveTwitchChannelName = (
    session?: Session,
    subscription?: Subscription,
) => {
    if (session && session.streamerDetails && session.streamerDetails.useTwitch) {
        return session.streamerDetails.twitchName;
    }

    if (subscription && subscription.streamerDetails && subscription.streamerDetails.useTwitch) {
        return subscription.streamerDetails.twitchName;
    }

    return;
}

export const renderTwitchStream = (
    view: HTMLDivElement,
    injected: boolean,
    session?: Session,
    subscription?: Subscription,
    tabSettings?: TabSettings,
) => {
    const twitchChannelName = resolveTwitchChannelName(session, subscription);
    if (!twitchChannelName) {
        return;
    }

    let stream: HTMLDivElement | undefined;
    if (injected) {
        stream = document.getElementById(DESTREAM_VIEW_STREAM_ID) as HTMLDivElement;
    } else {
        stream = document.createElement('div');
        stream.id = DESTREAM_VIEW_STREAM_ID;
        view.appendChild(stream);
    }
    if (!stream) {
        return;
    }


    const showChat = tabSettings?.showStreamChat === true;

    if (showChat) {
        styleSplitStream(stream);
    } else {
        styleFullStream(stream);
    }


    const STREAM = 'stream';
    const CHAT = 'chat';


    if (!injected) {
        const streamIframe = createIframe(STREAM, stream);
        streamIframe.src = `https://player.twitch.tv/?channel=${twitchChannelName}&parent=${location.hostname}`;
    }

    const chatInjected = !!document.querySelector(`#${composeIframeID(CHAT)}`);
    if (chatInjected) {
        if (!showChat) {
            const chatIframe = document.getElementById(composeIframeID(CHAT)) as HTMLIFrameElement;
            chatIframe.remove();
        }
    } else {
        if (showChat) {
            const chatIframe = createIframe(CHAT, stream);
            chatIframe.src = `https://www.twitch.tv/embed/${twitchChannelName}/chat?parent=${location.hostname}`;
        }
    }
}


export const resolveYoutubeChannelName = (
    session?: Session,
    subscription?: Subscription,
) => {
    if (session && session.streamerDetails && session.streamerDetails.useYoutube) {
        return session.streamerDetails.youtubeName;
    }

    if (subscription && subscription.streamerDetails && subscription.streamerDetails.useYoutube) {
        return subscription.streamerDetails.youtubeName;
    }
}

export const renderYoutubeStream = (
    view: HTMLDivElement,
    injected: boolean,
    session?: Session,
    subscription?: Subscription,
) => {
    const youtubeChannelName = resolveYoutubeChannelName(session, subscription);
    if (!youtubeChannelName) {
        return;
    }

    const stream = document.createElement('div');
    view.appendChild(stream);
    styleFullStream(stream);

    const streamIframe = createIframe('stream', stream);
    streamIframe.src = `https://www.youtube.com/@${youtubeChannelName}/live`;
}


export const resolveRenderType = (
    session?: Session,
    subscription?: Subscription,
) => {
    if (session && session.streamerDetails && session.streamerDetails.useTwitch) {
        return 'twitch';
    }
    if (subscription && subscription.streamerDetails && subscription.streamerDetails.useTwitch) {
        return 'twitch';
    }

    if (session && session.streamerDetails && session.streamerDetails.useYoutube) {
        return 'youtube';
    }
    if (subscription && subscription.streamerDetails && subscription.streamerDetails.useYoutube) {
        return 'youtube';
    }
}



export const injectView = (
    session: Session | undefined,
    subscription: Subscription | undefined,
    tabSettings: TabSettings,
) => {
    if (!tabSettings.showStream) {
        cleanupView();
        return;
    }

    const existingView = document.getElementById(DESTREAM_VIEW_ID) as HTMLDivElement;
    const injected = !!existingView;
    let view: HTMLDivElement | undefined;

    if (injected) {
        view = existingView;
    } else {
        view = document.createElement('div');
        view.id = DESTREAM_VIEW_ID;
        document.body.appendChild(view);
        styleView(view);
        makeResizable(view);

        window.addEventListener('keyup', (event) => {
            const shortcutHideKeyCode = 'KeyD';

            if (event.altKey && event.code === shortcutHideKeyCode) {
                if (view) {
                    if (view.style.display === 'none') {
                        view.style.display = 'block';
                    } else {
                        view.style.display = 'none';
                    }
                }
            }
        });
    }

    const renderType = resolveRenderType(session, subscription);

    switch (renderType) {
        case 'twitch':
            renderTwitchStream(view, injected, session, subscription, tabSettings);
            break;
        case 'youtube':
            renderYoutubeStream(view, injected, session, subscription);
            break;
    }
}

export const cleanupView = () => {
    const view = document.getElementById(DESTREAM_VIEW_ID);
    if (!view) {
        return;
    }

    view.remove();
}


const runView = async () => {
    const run = async () => {
        const tabID = await getTabID();
        const session = await getSession(tabID);
        const subscription = await getSubscription(tabID);
        const tabSettings = await getTabSettings(tabID);

        if (!tabSettings) {
            return;
        }

        if (session || subscription) {
            injectView(session, subscription, tabSettings);
        } else {
            cleanupView();
        }
    }


    await run();

    const storageLogic = async () => {
        await run();
    }

    storageAddListener(storageLogic);
}
// #endregion module



// #region exports
export default runView;
// #endregion exports
