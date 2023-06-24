// #region imports
    // #region external
    import {
        Handler,
        ReplaySessionMessage,
        Replayment,
        GENERAL_EVENT,
    } from '../../data';

    import {
        sendMessageToTab,
    } from '../../common/messaging';

    import {
        storageSet,
    } from '../../common/storage';

    import {
        openTab,
    } from '../utilities';

    import {
        getReplaymentStorageID,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaySession: Handler<ReplaySessionMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const {
        data,
    } = request;

    const {
        url,
        generatedAt,
        stoppedAt
    } = data;

    const tab = await openTab(url, true);

    setTimeout(async () => {
        await sendMessageToTab(tab.id, {
            type: GENERAL_EVENT.REPLAY_SESSION,
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
