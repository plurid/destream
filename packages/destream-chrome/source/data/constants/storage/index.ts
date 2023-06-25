// #region module
export const storagePrefix = {
    session: 'session-',
    subscription: 'subscription-',
    replayment: 'replayment-',
    linkage: 'linkage-',
    urlLinkages: 'url-linkages-',
    tabSettings: 'tab-settings-',
    destreamTopic: 'destream-',
} as const;


export const storageFields = {
    generalPermissions: 'generalPermissions',
    extendedDrawers: 'extendedDrawers',
    subscriptions: 'subscriptions',
} as const;
// #endregion module
