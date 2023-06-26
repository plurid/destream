// #region imports
    // #region external
    import {
        GENERAL_EVENT,
        NETFLIX_EVENT,
        SPOTIFY_EVENT,
        TWITCH_EVENT,
        YOUTUBE_EVENT,
    } from '~data/constants';

    import {
        checkNetflixOrigin,
    } from '~contentscript/utilities/netflix';

    import {
        checkSpotifyOrigin,
    } from '~contentscript/utilities/spotify';

    import {
        checkTwitchOrigin,
    } from '~contentscript/utilities/twitch';

    import {
        checkYoutubeOrigin,
    } from '~contentscript/utilities/youtube';

    import {
        handleEvent,
    } from '../event';
    // #endregion external
// #endregion imports



// #region module
export const linkageSetMediaTime = (
    time: number,
) => {
    if (checkNetflixOrigin()) return handleEvent({
        type: NETFLIX_EVENT.SEEK,
        payload: time,
    });

    if (checkSpotifyOrigin()) return handleEvent({
        type: SPOTIFY_EVENT.SEEK,
        payload: time,
    });

    if (checkTwitchOrigin()) return handleEvent({
        type: TWITCH_EVENT.SEEK,
        payload: time,
    });

    if (checkYoutubeOrigin()) return handleEvent({
        type: YOUTUBE_EVENT.SEEK,
        payload: time,
    });

    handleEvent({
        type: GENERAL_EVENT.SEEK,
        payload: time,
    });
}
// #endregion module
