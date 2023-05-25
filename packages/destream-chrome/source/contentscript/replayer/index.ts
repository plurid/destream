// #region imports
    // #region external
    import {
        GENERAL_EVENT,
        MESSAGE_TYPE,
        ReplaymentIndexMessage,
    } from '../../data';

    import {
        sendMessage,
    } from '../../common/messaging';

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
    client: MessagerClient,
) => {
    const tabID = await getTabID();

    let sessionPlayer: SessionPlayer | undefined;

    const messageListener = (
        request: any,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void,
    ) => {
        if (!request?.type) {
            sendResponse();
            return true;
        }

        if (request.type !== GENERAL_EVENT.REPLAY_SESSION && !sessionPlayer) {
            sendResponse();
            return true;
        }

        switch (request.type) {
            case GENERAL_EVENT.REPLAY_SESSION:
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
                        sendMessage<ReplaymentIndexMessage>(
                            {
                                type: MESSAGE_TYPE.REPLAYMENT_INDEX,
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
            case GENERAL_EVENT.REPLAY_SESSION_PLAY:
                sessionPlayer.play(
                    request.reset,
                );
                break;
            case GENERAL_EVENT.REPLAY_SESSION_PAUSE:
                sessionPlayer.pause();
                break;
            case GENERAL_EVENT.REPLAY_SESSION_STOP:
                sessionPlayer.stop();
                break;
            case GENERAL_EVENT.REPLAY_SESSION_INDEX:
                sessionPlayer.setIndex(request.data);
                break;
        }

        sendResponse();
        return true;
    }

    chrome.runtime.onMessage.addListener(messageListener);
}
// #endregion module



// #region exports
export default runReplayer;
// #endregion exports
