// #region module
export const IN_PRODUCTION = process.env.NODE_ENV === 'production';
export const IN_TRACING = process.env.TRACING === 'true';



export const destreamCurrentStateTopicSuffix = '/currentState';

export const LINKAGE_GROUP_PREFIX = 'linkage · ';
export const DESTREAM_GROUP_PREFIX = 'destream · ';



export const DESTREAM_DETECT_EVENT = 'destreamDetect';

export const resyncTimeout = 15 * 1_000; // seconds

export const NOTIFICATION_KIND = {
    URL_CHANGE: 'urlChange',
    URL_FAILED_TO_CHANGE: 'urlFailedToChange',
    SESSION_START: 'sessionStart',
} as const;



export const DESTREAM_PROTOCOL = 'destream://';



/**
 * Signal event listeners are asynchronous.
 */
export const ASYNCHRONOUS_RESPONSE = true;
// #endregion module
