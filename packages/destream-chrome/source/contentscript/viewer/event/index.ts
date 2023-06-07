// #region imports
    // #region external
    import {
        DestreamEvent,
        GENERAL_EVENT,
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
    } from '../controllers/netflix';

    import {
        spotifyPlayPause,
        spotifySeek,
        spotifyVolumeChange,
    } from '../controllers/spotify';

    import {
        youtubePlay,
        youtubePause,
        youtubeSeek,
        youtubeVolumeChange,
        youtubeRateChange,
        youtubeLike,
    } from '../controllers/youtube';

    import {
        twitchPlay,
        twitchPause,
        twitchSeek,
        twitchRateChange,
    } from '../controllers/twitch';
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
        }
    } catch (error) {
        return;
    }
}
// #endregion module
