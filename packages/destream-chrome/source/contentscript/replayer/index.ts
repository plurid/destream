// #region imports
    // #region external
    import {
        Message,
        MessageReplaymentIndex,
        ResponseMessage,
        RequestReplaymentPlay,
        RequestReplaymentIndex,

        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        ASYNCHRONOUS_RESPONSE,
    } from '~data/index';

    import {
        sendMessage,
        messageAddListener,
    } from '~common/messaging';

    import {
        MessageListener,
    } from '~common/types';

    import {
        log,
    } from '~common/utilities';

    import {
        getTabID,
    } from '../messaging';

    import MessagerClient from '../client';
    // #endregion external


    // #region internal
    import {
        SessionPlayer,
    } from './SessionPlayer';

    import {
        linkageSetMediaTime,
    } from './linkage';
    // #endregion internal
// #endregion imports



// #region module
const runReplayer = async (
    _client: MessagerClient,
) => {
    const tabID = await getTabID();
    if (!tabID) {
        return;
    }

    let sessionPlayer: SessionPlayer | undefined;

    const updateReplaymentIndex = (
        index: number,
    ) => {
        sendMessage<MessageReplaymentIndex, ResponseMessage>(
            {
                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.REPLAYMENT_INDEX,
                data: {
                    tabID,
                    index,
                },
            },
        ).catch(log);
    };


    const messageListener: MessageListener<Message, any> = (
        request,
        _sender,
        sendResponse,
    ) => {
        if (
            !request?.type
            || (
                !sessionPlayer && (
                    request.type !== MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION
                    && request.type !== MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_REBOOT
                )
            )
        ) {
            sendResponse();
            return ASYNCHRONOUS_RESPONSE;
        }

        switch (request.type) {
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION: {
                const {
                    generatedAt,
                    events,
                } = request.data;

                sessionPlayer = new SessionPlayer(
                    generatedAt,
                    events,
                    updateReplaymentIndex,
                );
                sessionPlayer.play();
                break;
            }
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_REBOOT: {
                const {
                    generatedAt,
                    events,
                } = request.data;

                sessionPlayer = new SessionPlayer(
                    generatedAt,
                    events,
                    updateReplaymentIndex,
                );
                sessionPlayer.setIndex(
                    request.index,
                );
                sessionPlayer.play();
                break;
            }
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PLAY:
                if (sessionPlayer) sessionPlayer.play(
                    (request as RequestReplaymentPlay).reset,
                );
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PAUSE:
                if (sessionPlayer) sessionPlayer.pause();
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_STOP:
                if (sessionPlayer) sessionPlayer.stop();
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_INDEX: {
                const index = ((request as any) as RequestReplaymentIndex).data
                if (sessionPlayer) sessionPlayer.setIndex(
                    index,
                );
                break;
            }
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SET_MEDIA_TIME:
                linkageSetMediaTime(
                    request.data,
                );
                break;
        }

        sendResponse();
        return ASYNCHRONOUS_RESPONSE;
    }

    messageAddListener(messageListener);
}
// #endregion module



// #region exports
export default runReplayer;
// #endregion exports
