// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentPause,
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';

    import {
        updateReplayment,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPause: Handler<MessageReplaymentPause> = async (
    request,
    _sender,
    sendResponse,
) => {
    const updated = await updateReplayment(
        request.data,
        {
            status: 'paused',
        },
    );
    if (!updated) {
        sendResponse({
            status: false,
        });
        return;
    }

    await sendMessageToTab(request.data, {
        type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PAUSE,
    });

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentPause;
// #endregion exports
