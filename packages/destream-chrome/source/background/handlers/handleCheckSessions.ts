// #region imports
    // #region external
    import {
        Handler,
        MessageCheckSessions,
        ResponseMessage,
    } from '~data/interfaces';

    import {
        origins,
        MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND,
    } from '~data/constants';

    import {
        getGeneralPermissions,
        noOp,
    } from '~background/utilities';
    // #endregion external


    // #region internal
    import handleStartSubscription from './handleStartSubscription';
    // #endregion internal
// #endregion imports



// #region module
const handleCheckSessions: Handler<MessageCheckSessions, ResponseMessage> = async (
    _request,
    sender,
    sendResponse,
) => {
    const generalPermissions = await getGeneralPermissions();
    if (!generalPermissions) {
        sendResponse({
            status: false,
        });
        return;
    }

    if (!sender.tab || !generalPermissions.autoCheckSessions) {
        sendResponse({
            status: false,
        });
        return;
    }

    const {
        url,
    } = sender.tab;

    if (!url) {
        sendResponse({
            status: false,
        });
        return;
    }

    const parsedURL = new URL(url);
    let streamerName: string | undefined;

    if (parsedURL.origin === origins.twitch) {
        const name = new URL(url).pathname.slice(1);
        if (!name.includes('/')) {
            streamerName = name;
        }
    } else if (parsedURL.origin === origins.youtube) {
        const re = /\/\@(\w+)\/?/;
        const match = new URL(url).pathname.match(re);
        if (match) {
            streamerName = match[1] || '';
        }
    }

    if (streamerName) {
        handleStartSubscription(
            {
                type: MESSAGE_POPUP_OR_OPTIONS_TO_BACKGROUND.START_SUBSCRIPTION,
                data: streamerName,
            },
            {},
            noOp,
        );

        sendResponse({
            status: true,
        });
        return;
    }


    sendResponse({
        status: false,
    });
    return;
}
// #endregion module



// #region exports
export default handleCheckSessions;
// #endregion exports
