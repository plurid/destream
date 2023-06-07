// #region imports
    // #region external
    import {
        DestreamEvent,
        GENERAL_EVENT,
        NETFLIX_EVENT,
        YOUTUBE_EVENT,
        TWITCH_EVENT,
        SPOTIFY_EVENT,
    } from '../../../data';

    import {
        generalScrollTo,
        generalCursorTo,
        generalURLChange,
    } from '../controllers/general';


    import {
        netflixPlay,
        netflixPause,
        netflixSeek,
        netflixRateChange,
    } from '../controllers/netflix';

    import {
        spotifyPlayPause,
        spotifySeek,
        spotifyVolumeChange,
    } from '../controllers/spotify';

    import {
        twitchPlay,
        twitchPause,
        twitchSeek,
        twitchRateChange,
    } from '../controllers/twitch';

    import {
        youtubePlay,
        youtubePause,
        youtubeSeek,
        youtubeVolumeChange,
        youtubeRateChange,
        youtubeLike,
    } from '../controllers/youtube';
    // #endregion external
// #endregion imports



// #region module
export const handleEvent = (
    event: DestreamEvent,
) => {
    try {
        switch (event.type) {
            case GENERAL_EVENT.SCROLL:
                generalScrollTo(event.payload.top, event.payload.left);
                break;
            case GENERAL_EVENT.CURSOR:
                generalCursorTo(event.payload.x, event.payload.y);
                break;
            case GENERAL_EVENT.URL_CHANGE:
                generalURLChange(event.payload.url);
                break;


            case NETFLIX_EVENT.PLAY:
                netflixPlay();
                break;
            case NETFLIX_EVENT.PAUSE:
                netflixPause();
                break;
            case NETFLIX_EVENT.SEEK:
                netflixSeek(event.payload);
                break;
            case NETFLIX_EVENT.RATE_CHANGE:
                netflixRateChange(event.payload);
                break;


            case SPOTIFY_EVENT.PLAY:
            case SPOTIFY_EVENT.PAUSE:
                spotifyPlayPause();
                break;
            case SPOTIFY_EVENT.SEEK:
                spotifySeek(event.payload);
                break;
            case SPOTIFY_EVENT.VOLUME_CHANGE:
                spotifyVolumeChange(event.payload);
                break;


            case TWITCH_EVENT.PLAY:
                twitchPlay();
                break;
            case TWITCH_EVENT.PAUSE:
                twitchPause();
                break;
            case TWITCH_EVENT.SEEK:
                twitchSeek(event.payload);
                break;
            case TWITCH_EVENT.RATE_CHANGE:
                twitchRateChange(event.payload);
                break;


            case YOUTUBE_EVENT.PLAY:
                youtubePlay();
                break;
            case YOUTUBE_EVENT.PAUSE:
                youtubePause();
                break;
            case YOUTUBE_EVENT.SEEK:
                youtubeSeek(event.payload);
                break;
            case YOUTUBE_EVENT.VOLUME_CHANGE:
                youtubeVolumeChange(event.payload);
                break;
            case YOUTUBE_EVENT.RATE_CHANGE:
                youtubeRateChange(event.payload);
                break;
            case YOUTUBE_EVENT.LIKE:
                youtubeLike();
                break;
        }
    } catch (error) {
        return;
    }
}
// #endregion module
