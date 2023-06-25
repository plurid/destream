// #region imports
    // #region external
    import {
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        MessageReplaymentIndex,
        ResponseMessage,
    } from '../../data';

    import {
        sendMessage,
        messageAddListener,
    } from '../../common/messaging';

    import {
        MessageListener,
    } from '../../common/types';

    import {
        log,
    } from '../../common/utilities';

    import {
        getTabID,
    } from '../messaging';

    import MessagerClient from '../client';
    // #endregion external


    // #region internal
    import {
        SessionPlayer,
    } from './SessionPlayer';
    // #endregion internal
// #endregion imports



// #region module
const runReplayer = async (
    _client: MessagerClient,
) => {
    const tabID = await getTabID();

    let sessionPlayer: SessionPlayer | undefined;

    const messageListener: MessageListener<any, any> = (
        request,
        _sender,
        sendResponse,
    ) => {
        if (!request?.type) {
            sendResponse();
            return true;
        }

        if (request.type !== MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION && !sessionPlayer) {
            sendResponse();
            return true;
        }

        switch (request.type) {
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAY_SESSION:
                const {
                    generatedAt,
                    events,
                } = request.data;

                sessionPlayer = new SessionPlayer(
                    generatedAt,
                    events,
                    (
                        index,
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
                    },
                );
                sessionPlayer.play();
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PLAY:
                sessionPlayer.play(
                    request.reset,
                );
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_PAUSE:
                sessionPlayer.pause();
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_STOP:
                sessionPlayer.stop();
                break;
            case MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.REPLAYMENT_INDEX:
                sessionPlayer.setIndex(
                    request.data,
                );
                break;
        }

        sendResponse();
        return true;
    }

    messageAddListener(messageListener);
}
// #endregion module



// #region exports
export default runReplayer;
// #endregion exports
