// #region imports
    // #region external
    import {
        Session,
        Subscription,
        TabSettings,
    } from '../../data/interfaces';

    import {
        checkYoutubeOrigin,
    } from '../utilities/youtube';

    import {
        getTabID,
        getSession,
        getSubscription,
        getTabSettings,
    } from '../messaging';
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
    session?: Session,
    subscription?: Subscription,
) => {
    const twitchChannelName = resolveTwitchChannelName(session, subscription);
    if (!twitchChannelName) {
        return;
    }

    const stream = document.createElement('div');
    view.appendChild(stream);
    styleStream(stream);

    const chatIframe = createIframe('chat', stream);
    chatIframe.src = `https://player.twitch.tv/?channel=${twitchChannelName}&parent=www.youtube.com`;

    const streamIframe = createIframe('stream', stream);
    streamIframe.src = `https://www.twitch.tv/embed/${twitchChannelName}/chat?parent=www.youtube.com`;
}


export const DESTREAM_VIEW_ID = 'destream-view';

export const injectView = (
    session?: Session,
    subscription?: Subscription,
    tabSettings?: TabSettings,
) => {
    const existingView = document.getElementById(DESTREAM_VIEW_ID);
    if (existingView) {
        if (tabSettings?.showStream) {
            return;
        }

        if (!tabSettings?.showStream) {
            cleanupView();
            return;
        }
    }


    if (!tabSettings?.showStream) {
        return;
    }


    if (!checkYoutubeOrigin()) return;


    const view = document.createElement('div');
    view.id = DESTREAM_VIEW_ID;
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


    renderTwitchStream(view, session, subscription);
}

export const cleanupView = () => {
    const view = document.getElementById(DESTREAM_VIEW_ID);
    if (view) {
        view.remove();
    }
}


const runView = async () => {
    const run = async () => {
        const tabID = await getTabID();
        const session = await getSession(tabID);
        const subscription = await getSubscription(tabID);
        const tabSettings = await getTabSettings(tabID);

        if (session || subscription) {
            injectView(session, subscription, tabSettings);
        } else {
            cleanupView();
        }

        return () => {
        }
    }


    let runCleanup = await run();

    const storageLogic = async () => {
        runCleanup();
        runCleanup = await run();
    }
    chrome.storage.onChanged.addListener(storageLogic);

    return () => {
        runCleanup();
        chrome.storage.onChanged.removeListener(storageLogic);
    }
}
// #endregion module



// #region exports
export default runView;
// #endregion exports
