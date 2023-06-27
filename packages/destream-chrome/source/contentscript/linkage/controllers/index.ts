// #region imports
    // #region external
    import {
        DestreamLinkage,
        DestreamLinkageSession,
        MessageReplaymentInitialize,
        MessagerLinkageFocusSessionPage,
        MessagerLinkageSetMediaTime,
        MessagerLinkageCloseSessionPage,
        MessagerLinkageFocusInitialPage,
        MessagerLinkageSessionEnded,

        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
    } from '~data/index';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        log,
    } from '~common/utilities';


    import {
        getGeneralVideoPlayer,
    } from '~contentscript/utilities/general';

    import {
        checkNetflixOrigin,
        getNetflixVideoPlayer,
    } from '~contentscript/utilities/netflix';

    import {
        checkSpotifyOrigin,
    } from '~contentscript/utilities/spotify';

    import {
        checkTwitchOrigin,
        getTwitchVideoPlayer,
    } from '~contentscript/utilities/twitch';

    import {
        checkYoutubeOrigin,
        getYoutubeVideoPlayer,
    } from '~contentscript/utilities/youtube';

    import {
        generalVideoPause,
        generalVideoPlay,
    } from '~contentscript/viewer/controllers/general';

    import {
        netflixPause,
        netflixPlay,
    } from '~contentscript/viewer/controllers/netflix';

    import {
        twitchPause,
        twitchPlay,
    } from '~contentscript/viewer/controllers/twitch';

    import {
        youtubePause,
        youtubePlay,
    } from '~contentscript/viewer/controllers/youtube';

    import {
        Counter,
        EventListener,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export class LinkageController {
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


    private getMediaPlayer() {
        if (checkNetflixOrigin()) return getNetflixVideoPlayer();
        if (checkSpotifyOrigin()) return;
        if (checkTwitchOrigin()) return getTwitchVideoPlayer();
        if (checkYoutubeOrigin()) return getYoutubeVideoPlayer();

        return getGeneralVideoPlayer();
    }

    private mediaPlay() {
        if (checkNetflixOrigin()) return netflixPlay();
        if (checkSpotifyOrigin()) return;
        if (checkTwitchOrigin()) return twitchPlay();
        if (checkYoutubeOrigin()) return youtubePlay();

        return generalVideoPlay();
    }

    private mediaPause() {
        if (checkNetflixOrigin()) return netflixPause();
        if (checkSpotifyOrigin()) return;
        if (checkTwitchOrigin()) return twitchPause();
        if (checkYoutubeOrigin()) return youtubePause();

        return generalVideoPause();
    }


    private registerStarter(
        session: DestreamLinkageSession,
    ) {
        try {
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
                    const mediaPlayer = this.getMediaPlayer();
                    if (!mediaPlayer) {
                        break;
                    }

                    const handler = () => {
                        if (mediaPlayer.currentTime >= starter.data) {
                            mediaPlayer.removeEventListener('timeupdate', handler);
                            this.playLinkage(session);
                        }
                    }

                    mediaPlayer.addEventListener('timeupdate', handler);
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
                            this.mediaPause();
                            break;
                    }
                }
            });

            this.eventer.addEventListener('afterStart', () => {
                for (const event of afterStart) {
                    switch (event.type) {
                        case 'focusSessionPage':
                            sendMessage<MessagerLinkageFocusSessionPage>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_SESSION_PAGE,
                                sessionID: id,
                                linkageID: this.data.id,
                            }).catch(log);
                            break;
                        case 'setMediaTime':
                            sendMessage<MessagerLinkageSetMediaTime>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_SET_MEDIA_TIME,
                                sessionID: id,
                                linkageID: this.data.id,
                                data: event.data,
                            }).catch(log);
                            break;
                    }
                }
            });

            this.eventer.addEventListener('afterEnd', () => {
                for (const event of afterEnd) {
                    switch (event.type) {
                        case 'closeSessionPage':
                            sendMessage<MessagerLinkageCloseSessionPage>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_CLOSE_SESSION_PAGE,
                                sessionID: id,
                                linkageID: this.data.id,
                            }).catch(log);
                            break;
                        case 'focusInitialPage':
                            sendMessage<MessagerLinkageFocusInitialPage>({
                                type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_FOCUS_INITIAL_PAGE,
                                sessionID: id,
                                linkageID: this.data.id,
                            }).catch(log);
                            break;
                        case 'playMediaInitialPage':
                            this.mediaPlay();
                            break;
                    }
                }

                sendMessage<MessagerLinkageSessionEnded>({
                    type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.LINKAGE_SESSION_ENDED,
                    sessionID: id,
                    linkageID: this.data.id,
                }).catch(log);
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
}
// #endregion module
