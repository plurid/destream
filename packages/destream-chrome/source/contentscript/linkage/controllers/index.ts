// #region imports
    // #region external
    import {
        DestreamLinkage,
        DestreamLinkageSession,
    } from '~data/interfaces';

    import {
        log,
    } from '~common/utilities';

    import {
        getGeneralVideoPlayer,
    } from '../../utilities/general';

    import {
        Counter,
        EventListener,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export interface Controller {
    stop: () => void;

    eventer: EventListener;
}


export class GeneralLinkage {
    private counter: Counter | undefined;
    public eventer: EventListener;


    constructor(
        data: DestreamLinkage,
    ) {
        this.eventer = new EventListener();

        for (const session of data.sessions) {
            this.registerStarter(session);
        }
    }


    private registerStarter(
        session: DestreamLinkageSession,
    ) {
        try {
            const videoPlayer = getGeneralVideoPlayer();
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
