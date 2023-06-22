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
            beforeStart,
            afterStart,
            afterEnd,
        } = session;

        // enqueue beforeStart, afterStart, afterEnd
    }


    public stop() {

    }
}
// #endregion module
