// #region imports
    // #region external
    import {
        GeneralPermissions,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const hosts = {
    netflix: 'www.netflix.com',
    spotify: 'open.spotify.com',
    youtube: 'www.youtube.com',
    twitch: 'www.twitch.tv',
};

export const HTTPS = 'https://';

export const origins = {
    netflix: HTTPS + hosts.netflix,
    spotify: HTTPS + hosts.spotify,
    youtube: HTTPS + hosts.youtube,
    twitch: HTTPS + hosts.twitch,
};

export const defaultAllowedURLOrigins = [
    origins.netflix,
    origins.spotify,
    origins.youtube,
    origins.twitch,
];

export const defaultPermissions: GeneralPermissions = {
    useTelemetry: false,
    useNotifications: true,
    useSessionGroups: true,
    autoCheckLinkages: false,
    allowScroll: true,
    allowPlayPause: true,
    allowTimeSeek: true,
    allowVolumeControl: true,
    allowRateControl: true,
    allowLike: false,
    allowChangeURL: false,
    allowChangeURLAnyOrigin: false,
    allowedURLOrigins: [
        ...defaultAllowedURLOrigins,
    ],
    allowedOriginsStreamers: [],
};



export const uncontrollableURLsBase = [
    'chrome://',
];
// #endregion module
