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
    if (!sender.tab || !generalPermissions.autoCheckSessions) {
        sendResponse({
            status: false,
        });
        return;
    }

    const {
        url,
    } = sender.tab;

    const parsedURL = new URL(url);
    let streamerName: string | undefined;

    if (parsedURL.origin === origins.twitch) {
        streamerName = new URL(url).pathname.slice(1);
    } else if (parsedURL.origin === origins.youtube) {
        streamerName = new URL(url).pathname.slice(1);
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
