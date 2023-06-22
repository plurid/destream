// #region imports
    // #region external
    import {
        DestreamLinkage,
        DestreamLinkageSession,
    } from '../../../data/interfaces';

    import {
        log,
    } from '../../../common/utilities';

    import {
        getYoutubeVideoPlayer,
    } from '../../utilities/youtube';

    import {
        Counter,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export class YoutubeLinkage {
    private counter: Counter | undefined;


    constructor(
        data: DestreamLinkage,
    ) {
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

    private playLinkage(
        session: DestreamLinkageSession,
    ) {
        const {
            id,
            beforeStart,
            afterStart,
            afterEnd,
        } = session;

        // start a replayment based on the session id

        // manage various events

        for (const event of beforeStart) {
            switch (event.type) {
                case 'pauseMediaInitialPage':
                    break;
            }
        }

        for (const event of afterStart) {
            switch (event.type) {
                case 'focusSessionPage':
                    break;
            }
        }

        for (const event of afterEnd) {
            switch (event.type) {
                case 'closeSessionPage':
                    break;
                case 'focusInitialPage':
                    break;
                case 'playMediaInitialPage':
                    break;
            }
        }
    }


    public stop() {

    }
}
// #endregion module
