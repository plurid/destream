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
        youtubeApplyCurrentState,
    } from '../controllers/youtube';

    import {
        twitchApplyCurrentState,
    } from '../controllers/twitch';
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
        case hosts.youtube:
            youtubeApplyCurrentState(state);
            break;
        case hosts.twitch:
            twitchApplyCurrentState(state);
            break;
    }
}
// #endregion module
