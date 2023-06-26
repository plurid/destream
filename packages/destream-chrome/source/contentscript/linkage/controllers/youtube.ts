// #region imports
    // #region external
    import {
        MessageReplaymentInitialize,
        DestreamLinkage,
        DestreamLinkageSession,

        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
    } from '~data/index';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        log,
    } from '~common/utilities';

    import {
        getYoutubeVideoPlayer,
    } from '../../utilities/youtube';

    import {
        youtubePlay,
        youtubePause,
        youtubeSeek,
    } from '../../viewer/controllers/youtube';

    import {
        Counter,
        EventListener,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export class YoutubeLinkage {
    public data: DestreamLinkage;
    public eventer: EventListener;
    private counter: Counter | undefined;


    constructor(
        data: DestreamLinkage,
    ) {
        this.data = data;
        this.eventer = new EventListener();

        for (const session of data.sessions) {
            this.registerStarter(session);
        }
    }


    private registerStarter(
        session: DestreamLinkageSession,
    ) {
        try {
            const videoPlayer = getYoutubeVideoPlayer();
            if (!videoPlayer) {
                return;
            }

            const starter = session.starter[0];
            switch (starter.type) {
                case 'afterTimeOnPage':
                    this.counter = new Counter(
                        starter.data,
                        () => {
                            this.playLinkage(session);
                        },
                    );
                    break;
                case 'atMediaTime':
                    const handler = () => {
                        if (videoPlayer.currentTime >= starter.data) {
                            videoPlayer.removeEventListener('timeupdate', handler);
                            this.playLinkage(session);
                        }
                    }

                    videoPlayer.addEventListener('timeupdate', handler);
                    break;
            }
        } catch (error) {
            log(error);
        }
    }

    private async playLinkage(
        session: DestreamLinkageSession,
    ) {
        try {
            const {
                id,
                beforeStart,
                afterStart,
                afterEnd,
            } = session;


            this.eventer.addEventListener('beforeStart', () => {
                for (const event of beforeStart) {
                    switch (event.type) {
                        case 'pauseMediaInitialPage':
                            youtubePause();
                            break;
                    }
                }
            });

            this.eventer.addEventListener('afterStart', () => {
                for (const event of afterStart) {
                    switch (event.type) {
                        case 'focusSessionPage':
                            sendMessage<any>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_SESSION_PAGE,
                                sessionID: id,
                                linkageID: this.data.id,
                            }).catch(log);
                            break;
                        case 'setMediaTime':
                            youtubeSeek(event.data);
                            break;
                    }
                }
            });

            this.eventer.addEventListener('afterEnd', () => {
                for (const event of afterEnd) {
                    switch (event.type) {
                        case 'closeSessionPage':
                            sendMessage<any>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_CLOSE_SESSION_PAGE,
                                sessionID: id,
                                linkageID: this.data.id,
                            }).catch(log);
                            break;
                        case 'focusInitialPage':
                            sendMessage<any>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_INITIAL_PAGE,
                                sessionID: id,
                                linkageID: this.data.id,
                            }).catch(log);
                            break;
                        case 'playMediaInitialPage':
                            youtubePlay();
                            break;
                    }
                }
            });


            await sendMessage<MessageReplaymentInitialize>({
                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.REPLAYMENT_INITIALIZE,
                data: id,
                linkageID: this.data.id,
            }).catch(log);
        } catch (error) {
            log(error);
        }
    }


    public stop() {

    }
}
// #endregion module
