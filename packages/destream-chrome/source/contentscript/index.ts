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



const test = () => {
    setTimeout(() => {
        handleEvent({
            type: 'youtubePlayPause',
        });

        setTimeout(() => {
            handleEvent({
                type: 'youtubeMute',
            });

            handleEvent({
                type: 'youtubeSeek',
                payload: 10,
            });
        }, 3000);
    }, 3000);
}

// test();
