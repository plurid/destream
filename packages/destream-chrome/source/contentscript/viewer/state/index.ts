// #region imports
    // #region external
    import {
        hosts,
    } from '../../../data';

    import {
        netflixApplyCurrentState,
    } from '../controllers/netflix';

    import {
        spotifyApplyCurrentState,
    } from '../controllers/spotify';

    import {
        twitchApplyCurrentState,
    } from '../controllers/twitch';

    import {
        youtubeApplyCurrentState,
    } from '../controllers/youtube';
    // #endregion external
// #endregion imports



// #region module
export const applyCurrentState = (
    state: any,
) => {
    switch (window.location.host) {
        case hosts.netflix:
            netflixApplyCurrentState(state);
            break;
        case hosts.spotify:
            spotifyApplyCurrentState(state);
            break;
        case hosts.twitch:
            twitchApplyCurrentState(state);
            break;
        case hosts.youtube:
            youtubeApplyCurrentState(state);
            break;
    }
}
// #endregion module
