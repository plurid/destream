// #region imports
    // #region external
    import {
        Handler,
        MessageReplaymentIndex,
        ResponseMessage,
        RequestReplaymentIndex,
        RequestReplaymentPause,
        MessageLinkageSessionEnded,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/index';

    import {
        sendMessageToTab,
    } from '~common/messaging';

    import {
        updateReplayment,
        replaymentAtEnd,
    } from '../replayments';

    import {
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
                await sendMessageToTab<MessageLinkageSessionEnded>(linkage.tabID, {
                    type: MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_ENDED,
                    data: linkage.id,
                });
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
