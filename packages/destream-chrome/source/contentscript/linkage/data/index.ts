// #region imports
    // #region external
    import {
        MESSAGE_BACKGROUND_TO_CONTENTSCRIPT,
    } from '~data/constants';
    // #endregion external
// #endregion imports



// #region module
export const LINKAGE_EVENT = {
    BEFORE_START: 'beforeStart',
    AFTER_START: 'afterStart',
    AFTER_END: 'afterEnd',
};

export const linkageEventMap: Record<string, string> = {
    [MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTING]: LINKAGE_EVENT.BEFORE_START,
    [MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_STARTED]: LINKAGE_EVENT.AFTER_START,
    [MESSAGE_BACKGROUND_TO_CONTENTSCRIPT.LINKAGE_ENDED]: LINKAGE_EVENT.AFTER_END,
};
// #endregion module
