// #region imports
    // #region external
    import {
        Handler,
        URLChangeMessage,
        storageFields,
        GeneralPermissions,
    } from '../../data';

    import {
        storageGet,
    } from '../../common/storage';

    import {
        getSubscriptionByTabID,
    } from '../subscriptions';

    import {
        sendNotificationURLChange,
    } from '../notifications';
    // #endregion external
// #endregion imports



// #region module
const handleURLChange: Handler<URLChangeMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const reject = () => {
        sendResponse({
            status: false,
        });
    }

    const subscription = await getSubscriptionByTabID(sender.tab?.id);
    if (!subscription) {
        return reject();
    }


    const allowed = (
        notification: boolean,
    ) => {
        if (notification) {
            sendNotificationURLChange(
                subscription.streamer,
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


    const generalPermissions = await storageGet<GeneralPermissions>(storageFields.generalPermissions);
    if (!generalPermissions) {
        return reject();
    }

    if (!generalPermissions.allowChangeURL) {
        return reject();
    }

    if (generalPermissions.allowChangeURLAnyOrigin) {
        return allowed(generalPermissions.useNotifications);
    }

    const urlOrigin = new URL(request.data).origin;
    if (generalPermissions.allowedURLOrigins.includes(urlOrigin)) {
        return allowed(generalPermissions.useNotifications);
    }

    return reject();
}
// #endregion module



// #region exports
export default handleURLChange;
// #endregion exports