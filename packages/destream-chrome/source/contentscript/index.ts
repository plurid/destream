import {
    youtubeMute,
    youtubePlayPause,
    youtubeLike,
    youtubeSeek,
} from './controllers/youtube';

import {
    YoutubeDetector,
} from './detectors/youtube';



export interface DestreamEvent {
    type: string;
    payload?: any;
}

export const handleEvent = (
    event: DestreamEvent,
) => {
    switch (event.type) {
        case 'youtubePlayPause':
            youtubePlayPause();
            break;
        case 'youtubeMute':
            youtubeMute();
            break;
        case 'youtubeLike':
            youtubeLike();
            break;
        case 'youtubeSeek':
            youtubeSeek(event.payload ?? 0);
            break;
    }
}


chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    handleEvent(request.event);

    sendResponse({
        status: true,
    });
});


const youtubeDetector = new YoutubeDetector();
youtubeDetector.target.addEventListener('destreamDetect', (event: CustomEvent<DestreamEvent>) => {
    console.log(event.detail);
    // handleEvent(event.detail);
});
