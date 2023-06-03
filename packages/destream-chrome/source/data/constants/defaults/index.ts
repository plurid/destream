// #region imports
    // #region external
    import {
        GeneralPermissions,
    } from '../../interfaces';
    // #endregion external
// #endregion imports



// #region module
export const hosts = {
    netflix: 'www.netflix.com',
    spotify: 'open.spotify.com',
    youtube: 'www.youtube.com',
};

export const HTTPS = 'https://';

export const origins = {
    netflix: HTTPS + hosts.netflix,
    spotify: HTTPS + hosts.spotify,
    youtube: HTTPS + hosts.youtube,
};

export const defaultAllowedURLOrigins = [
    origins.netflix,
    origins.spotify,
    origins.youtube,
];

export const defaultPermissions: GeneralPermissions = {
    useNotifications: true,
    useSessionGroups: true,
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
};



export const uncontrollableURLsBase = [
    'chrome://',
];
// #endregion module
