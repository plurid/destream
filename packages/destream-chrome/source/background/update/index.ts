// #region imports
    // #region external
    import {
        getSession,
    } from '../sessions';

    import {
        getSubscriptionByTabID,
    } from '../subscriptions';
    // #endregion external
// #endregion imports



// #region module
const update = async (
    tabID: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
) => {
    // if (!changeInfo.title) {
    //     return;
    // }

    const session = await getSession(tabID);
    const subscription = await getSubscriptionByTabID(tabID);

    console.log({
        tabID,
        changeInfo,
        tab,
        session,
        subscription,
    });
}
// #endregion module



// #region exports
export default update
// #endregion exports
