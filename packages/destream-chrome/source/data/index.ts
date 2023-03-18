// #region module
export interface DestreamEvent {
    type: string;
    payload?: any;
}


export const DESTREAM_DETECT_EVENT = 'destreamDetect';

export const YOUTUBE_EVENT = {
    PLAY: 'youtubePlay',
    PAUSE: 'youtubePause',
    SEEK: 'youtubeSeek',
    VOLUME_CHANGE: 'youtubeVolumeChange',
    RATE_CHANGE: 'youtubeRateChange',
    LIKE: 'youtubeLike',
};
// #endregion module
