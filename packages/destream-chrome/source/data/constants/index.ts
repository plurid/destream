// #region module
export const IN_PRODUCTION = process.env.NODE_ENV === 'production';

export const DEFAULT_API_ENDPOINT = process.env.API_ENDPOINT;

export const STREAMER_REGISTRATION_URL = 'https://destream.plurid.com';



export const storagePrefix = {
    session: 'session-',
    subscription: 'subscription-',
    tabSettings: 'tab-settings-',
    destreamTopic: 'destream-',
};

export const storageFields = {
    generalPermissions: 'generalPermissions',
    extendedDrawers: 'extendedDrawers',
} as const;



export const DESTREAM_DETECT_EVENT = 'destreamDetect';


export const NOTIFICATION_KIND = {
    URL_CHANGE: 'urlChange',
    SESSION_START: 'sessionStart',
} as const;


export const MESSAGE_TYPE = {
    PUBLISH_EVENT: 'publishEvent',
    GET_TAB_ID: 'getTabID',
    GET_SESSION: 'getSession',
    SEND_NOTIFICATION: 'sendNotification',
    START_SESSION: 'startSession',
    STOP_SESSION: 'stopSession',
    START_SUBSCRIPTION: 'startSubscription',
    STOP_SUBSCRIPTION: 'stopSubscription',
    GET_SUBSCRIPTION: 'getSubscription',
    DESTREAM_EVENT: 'destreamEvent',
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


export const defaultAllowedURLOrigins = [
    'https://www.netflix.com',
    'https://open.spotify.com',
    'https://www.youtube.com',
];


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




export const uncontrollableURLsBase = [
    'chrome://',
];
// #endregion module
