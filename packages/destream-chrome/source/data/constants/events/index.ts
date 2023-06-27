// #region module
export const GENERAL_EVENT = {
    INITIAL_STATE: 'generalInitialState',
    SCROLL: 'generalScroll',
    CURSOR: 'generalCursor',
    PLAY: 'generalPlay',
    PAUSE: 'generalPause',
    SEEK: 'generalSeek',
    VOLUME_CHANGE: 'generalVolumeChange',
    RATE_CHANGE: 'generalRateChange',
    URL_CHANGE: 'generalURLChange',
    STOP_SESSION: 'generalStopSession',
    START_ANOTHER_SESSION: 'generalStartAnotherSession',
    STOP_SUBSCRIPTION: 'generalStopSubscription',
    CURRENT_STATE: 'generalCurrentState',
} as const;

export const YOUTUBE_EVENT = {
    PLAY: 'youtubePlay',
    PAUSE: 'youtubePause',
    SEEK: 'youtubeSeek',
    VOLUME_CHANGE: 'youtubeVolumeChange',
    RATE_CHANGE: 'youtubeRateChange',
    LIKE: 'youtubeLike',
} as const;

export const TWITCH_EVENT = {
    PLAY: 'twitchPlay',
    PAUSE: 'twitchPause',
    SEEK: 'twitchSeek',
    VOLUME_CHANGE: 'twitchVolumeChange',
    RATE_CHANGE: 'twitchRateChange',
} as const;

export const NETFLIX_EVENT = {
    PLAY: 'netflixPlay',
    PAUSE: 'netflixPause',
    SEEK: 'netflixSeek',
    VOLUME_CHANGE: 'netflixVolumeChange',
    RATE_CHANGE: 'netflixRateChange',
} as const;

export const SPOTIFY_EVENT = {
    PLAY: 'spotifyPlay',
    PAUSE: 'spotifyPause',
    SEEK: 'spotifySeek',
    VOLUME_CHANGE: 'spotifyVolumeChange',
    RATE_CHANGE: 'spotifyRateChange',
} as const;
// #endregion module
