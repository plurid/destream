// #region imports
    // #region external
    import {
        Handler,
        MessageReplaySession,
        RequestReplaySession,
        ResponseMessage,
        Replayment,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        storageSet,
    } from '~common/storage';

    import {
        openTab,
    } from '../utilities';

    import {
        getReplaymentStorageID,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaySession: Handler<MessageReplaySession, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const {
        data,
        linkage,
    } = request;

    const {
        url,
        generatedAt,
        stoppedAt
    } = data;

    const tab = await openTab(url, true);

    setTimeout(async () => {
        // Let tab load.
        await sendMessageToTab<RequestReplaySession>(tab.id, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION,
            data,
        });
    }, 2_000);

    const replayment: Replayment = {
        tabID: tab.id,
        data,
        currentIndex: 0,
        status: 'playing',
        duration: typeof stoppedAt === 'number'
            ? stoppedAt - generatedAt
            : 0,
        linkage,
    };
    await storageSet(getReplaymentStorageID(tab.id), replayment);

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaySession;
// #endregion exports
