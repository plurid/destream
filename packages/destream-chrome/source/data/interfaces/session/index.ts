// #region module
export interface DestreamSession {
    id: string;
    generatedAt: number;
    streamerName: string;
    title: string;
    url: string;
    incognito?: boolean;
    status: string;
    events: {
        data: string; // stringified event
        relativeTime: number;
    }[];
    stoppedAt?: number;
}
// #endregion module
