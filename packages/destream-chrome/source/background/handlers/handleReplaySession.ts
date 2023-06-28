// #region imports
    // #region external
    import {
        Handler,
        MessageReplaySession,
        RequestReplaySession,
        ResponseMessage,
        Replayment,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        LINKAGE_GROUP_PREFIX,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        storageSet,
        storageUpdate,
    } from '~common/storage';

    import {
        destreamIDGetDisplay,
    } from '~common/utilities';

    import {
        openTab,
        assignTabToGroup,
        getGeneralPermissions,
    } from '../utilities';

    import {
        getReplaymentStorageID,
    } from '../replayments';

    import {
        getLinkageStorageID,
        getLinkageByID,
    } from '../linkages';
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
        linkageID,
    } = request;

    const {
        url,
        generatedAt,
        stoppedAt
    } = data;

    const activeTab = linkageID ? false : true;
    const tab = await openTab(url, activeTab);

    setTimeout(async () => {
        // Let tab load.
        await sendMessageToTab<RequestReplaySession>(tab.id, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION,
            data,
        });
    }, 2_000);

    const replayment: Replayment = {
        tabID: tab.id,
        streamer: data.streamer,
        data,
        currentIndex: 0,
        status: 'playing',
        duration: typeof stoppedAt === 'number'
            ? stoppedAt - generatedAt
            : 0,
        linkageID,
    };
    await storageSet(getReplaymentStorageID(tab.id), replayment);

    if (linkageID) {
        const linkage = await getLinkageByID(linkageID);

        if (linkage) {
            const generalPermissions = await getGeneralPermissions();
            const groupTitle = LINKAGE_GROUP_PREFIX + linkage.name;
            await assignTabToGroup(
                tab, groupTitle, generalPermissions,
            );

            const newSessionTabs = {
                ...linkage.sessionTabs,
                [destreamIDGetDisplay(data.id)]: tab.id,
            };
            await storageUpdate(
                getLinkageStorageID(linkage.tabID),
                {
                    sessionTabs: newSessionTabs,
                },
            );
        }
    }

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaySession;
// #endregion exports
