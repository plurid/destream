// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentIndex,
        ResponseMessage,
        RequestReplaymentIndex,
        RequestReplaymentPause,
        MessageLinkageEnded,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        storageRemove,
    } from '~common/storage';

    import {
        updateReplayment,
        replaymentAtEnd,
    } from '../replayments';

    import {
        getLinkageStorageID,
        getLinkageByID,
    } from '../linkages';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentIndex: Handler<MessageReplaymentIndex, ResponseMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const replayment = await updateReplayment(
        request.data.tabID,
        {
            currentIndex: request.data.index,
        },
    );
    if (!replayment) {
        sendResponse({
            status: false,
        });
        return;
    }

    if (request.data.updateTab) {
        await sendMessageToTab<RequestReplaymentIndex>(request.data.tabID, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_INDEX,
            data: request.data.index,
        });
    }

    if (replaymentAtEnd(replayment, request.data.index)) {
        await updateReplayment(
            request.data.tabID,
            {
                status: 'paused',
            },
        );

        await sendMessageToTab<RequestReplaymentPause>(request.data.tabID, {
            type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PAUSE,
        });

        if (replayment.linkageID) {
            const linkage = await getLinkageByID(replayment.linkageID);
            if (linkage) {
                // session ended, check if there are other sessions running
                await sendMessageToTab<MessageLinkageEnded>(linkage.tabID, {
                    type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_ENDED,
                    data: linkage.id,
                });

                setTimeout(async () => {
                    const linkageStorageID = getLinkageStorageID(linkage.tabID);
                    await storageRemove(linkageStorageID);
                }, 3_000);
            }
        }
    }

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentIndex;
// #endregion exports
