// #region module
export interface YoutubeCurrentState {
    url: string;
    video: {
        currentTime: number;
        volume: number;
        playbackRate: number;
        paused: boolean;
    };
}


export interface TwitchCurrentState {
    url: string;
    video: {
        currentTime: number;
        volume: number;
        playbackRate: number;
        paused: boolean;
    };
}


export interface NetflixCurrentState {
    url: string;
    video: {
        currentTime: number;
        volume: number;
        playbackRate: number;
        paused: boolean;
    };
}
// #endregion module
