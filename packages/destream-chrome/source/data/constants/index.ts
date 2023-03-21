// #region module
// export const DEFAULT_PUBLISH_ENDPOINT = 'https://api.plurid.com/graphql';
export const DEFAULT_PUBLISH_ENDPOINT = 'http://localhost:3000/publish';


export const DESTREAM_DETECT_EVENT = 'destreamDetect';


export const NOTIFICATION_URL_CHANGE = 'destream-url-change';

export const NOTIFICATION_KIND = {
    URL_CHANGE: 'urlChange',
} as const;


export const MESSAGE_TYPE = {
    PUBLISH_EVENT: 'publishEvent',
    GET_TAB_ID: 'getTabID',
    GET_SESSION: 'getSession',
    SEND_NOTIFICATION: 'sendNotification',
} as const;


export const GENERAL_EVENT = {
    SCROLL: 'generalScroll',
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
