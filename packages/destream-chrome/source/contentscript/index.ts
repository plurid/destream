import {
    youtubeMute,
    youtubePlayPause,
    youtubeSeek,
} from './controllers/youtube';



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
