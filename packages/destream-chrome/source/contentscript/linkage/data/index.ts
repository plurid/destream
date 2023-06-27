// #region imports
    // #region external
    import {
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export const LINKAGE_SESSION_EVENT = {
    BEFORE_START: 'beforeStart',
    AFTER_START: 'afterStart',
    AFTER_END: 'afterEnd',
} as const;

export const linkageEventMap: Record<string, string> = {
    [MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_STARTING]: LINKAGE_SESSION_EVENT.BEFORE_START,
    [MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_STARTED]: LINKAGE_SESSION_EVENT.AFTER_START,
    [MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_SESSION_ENDED]: LINKAGE_SESSION_EVENT.AFTER_END,
};
// #endregion module
