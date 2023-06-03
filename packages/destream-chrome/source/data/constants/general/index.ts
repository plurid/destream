// #region module
export const IN_PRODUCTION = process.env.NODE_ENV === 'production';



export const destreamCurrentStateTopicSuffix = '/currentState';



export const DESTREAM_DETECT_EVENT = 'destreamDetect';



export const NOTIFICATION_KIND = {
    URL_CHANGE: 'urlChange',
    URL_FAILED_TO_CHANGE: 'urlFailedToChange',
    SESSION_START: 'sessionStart',
} as const;



export const TAB_GROUP_SUFFIX = ' · destream';



export const resyncTimeout = 15 * 1_000; // seconds
// #endregion module
