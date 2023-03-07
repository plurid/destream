import {
    getYoutubeVideoPlayer,
} from '../controllers/youtube';



const checkYoutubeOrigin = () => {
    return window.location.origin === 'https://www.youtube.com';
}


export class YoutubeDetector {
    private video: HTMLVideoElement;
    public target: EventTarget;

    constructor() {
        this.target = new EventTarget();
        this.video = getYoutubeVideoPlayer() as HTMLVideoElement;
        this.initialize();
    }

    private initialize() {
        if (!checkYoutubeOrigin()) {
            return;
        }

        this.video.addEventListener('play', this.onPlay.bind(this));
        this.video.addEventListener('pause', this.onPause.bind(this));
    }

    private onPlay() {
        console.log('youtube detector play');

        const event = new CustomEvent('destreamDetect', { detail: { type: 'youtubePlay'} });
        this.target.dispatchEvent(event);
    }

    private onPause() {
        console.log('youtube detector pause');

        const event = new CustomEvent('destreamDetect', { detail: { type: 'youtubePause'} });
        this.target.dispatchEvent(event);
    }
}
