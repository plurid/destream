// #region module
export const DEFAULT_MESSAGER_ENDPOINT = process.env.MESSAGER_ENDPOINT;
export const DEFAULT_MESSAGER_TOKEN = process.env.MESSAGER_TOKEN;


export const DEFAULT_API_ENDPOINT = process.env.API_ENDPOINT;


export const DESTREAM_DETECT_EVENT = 'destreamDetect';

export const DESTREAM_EVENT = 'destreamEvent';


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


export const defaultPermissions = {
    allowScroll: true,
    allowPlayPause: true,
    allowTimeSeek: true,
    allowVolumeControl: true,
    allowRateControl: true,
    allowLike: false,
    allowChangeURL: false,
};


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
