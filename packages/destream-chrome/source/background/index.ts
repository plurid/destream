// #region imports
    // #region external
    import {
        ASYNCHRONOUS_RESPONSE,
    } from '~data/constants';

    import {
        messageAddListener,
    } from '~common/messaging';

    import {
        tabsOnRemovedAddListener,
        tabsOnUpdatedAddListener,
    } from '~common/tab';

    import {
        log,
    } from '~common/utilities';
    // #endregion external


    // #region internal
    import {
        initialize,
        onTabRemovedListeners,
    } from './general';

    import messageHandler from './handlers';

    import {
        updateSession,
    } from './sessions';
    // #endregion internal
// #endregion imports



// #region module
const main = async () => {
    try {
        initialize();

        messageAddListener((request, sender, sendResponse) => {
            messageHandler(request, sender, sendResponse)
                .catch(error => {
                    log(error);
                });

            return ASYNCHRONOUS_RESPONSE;
        });

        tabsOnRemovedAddListener((tabID) => {
            onTabRemovedListeners.forEach(
                listener => listener(tabID).catch(error => log(error)),
            );
        });

        tabsOnUpdatedAddListener(updateSession);
    } catch (error) {
        log(error);
    }
}

main();
// #endregion module
