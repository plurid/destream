// #region module
export const GENERAL_EVENT = {
    SCROLL: 'generalScroll',
    CURSOR: 'generalCursor',
    URL_CHANGE: 'generalURLChange',
    STOP_SESSION: 'generalStopSession',
    START_ANOTHER_SESSION: 'generalStartAnotherSession',
    STOP_SUBSCRIPTION: 'generalStopSubscription',
    CURRENT_STATE: 'generalCurrentState',
    RESYNC_SESSION: 'generalResyncSession',
    REPLAY_SESSION: 'generalReplaySession',
    REPLAY_SESSION_PLAY: 'generalReplaySessionPlay',
    REPLAY_SESSION_PAUSE: 'generalReplaySessionPause',
    REPLAY_SESSION_STOP: 'generalReplaySessionStop',
    REPLAY_SESSION_DIRECTION: 'generalReplaySessionDirection',
    REPLAY_SESSION_INDEX: 'generalReplaySessionIndex',
    REPLAY_SESSION_SPEED: 'generalReplaySessionSpeed',
} as const;

export const YOUTUBE_EVENT = {
    PLAY: 'youtubePlay',
    PAUSE: 'youtubePause',
    SEEK: 'youtubeSeek',
    VOLUME_CHANGE: 'youtubeVolumeChange',
    RATE_CHANGE: 'youtubeRateChange',
    LIKE: 'youtubeLike',
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
