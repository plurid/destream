// #region imports
    // #region external
    import {
        Handler,
        MessageURLChange,
        ResponseMessage,
    } from '~data/index';

    import {
        getSubscriptionByTabID,
    } from '../subscriptions';

    import {
        getReplaymentByTabID,
    } from '../replayments';

    import {
        sendNotificationURLChange,
        sendNotificationURLFailedToChange,
    } from '../notifications';

    import {
        getGeneralPermissions,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
const handleURLChange: Handler<MessageURLChange, ResponseMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const reject = () => {
        sendResponse({
            status: false,
        });
    }

    if (!sender.tab?.id) {
        return reject();
    }

    const subscription = await getSubscriptionByTabID(sender.tab.id);
    const replayment = await getReplaymentByTabID(sender.tab.id);
    if (!subscription && !replayment) {
        return reject();
    }

    const streamerName = subscription?.streamer || replayment?.streamer;
    if (!streamerName) {
        return reject();
    }


    const allowed = (
        notify: boolean,
    ) => {
        if (notify) {
            sendNotificationURLChange(
                streamerName,
                sender.tab.id,
                request.data,
            );

            sendResponse({
                status: false,
            });
        } else {
            sendResponse({
                status: true,
            });
        }
    }


    const generalPermissions = await getGeneralPermissions();
    if (!generalPermissions) {
        return reject();
    }

    if (!generalPermissions.allowChangeURL) {
        if (generalPermissions.useNotifications) {
            sendNotificationURLFailedToChange(
                streamerName,
                sender.tab.id,
                request.data,
            );
        }

        return reject();
    }

    if (generalPermissions.allowChangeURLAnyOrigin) {
        return allowed(generalPermissions.useNotifications);
    }

    const urlOrigin = new URL(request.data).origin;
    if (generalPermissions.allowedURLOrigins.includes(urlOrigin)) {
        return allowed(generalPermissions.useNotifications);
    }

    if (generalPermissions.allowedOriginsStreamers.includes(streamerName)) {
        return allowed(generalPermissions.useNotifications);
    }

    return reject();
}
// #endregion module



// #region exports
export default handleURLChange;
// #endregion exports
