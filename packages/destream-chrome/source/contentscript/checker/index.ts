// #region imports
    // #region external
    import {
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
    } from '~data/constants';

    import {
        sendMessage,
    } from '~common/messaging';

    import {
        checkTwitchOrigin,
    } from '~contentscript/utilities/twitch';

    import {
        checkYoutubeOrigin,
    } from '~contentscript/utilities/youtube';
    // #endregion external
// #endregion imports



// #region module
const runChecker = async () => {
    if (!checkTwitchOrigin() && !checkYoutubeOrigin()) {
        return;
    }

    await sendMessage({
        type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.CHECK_SESSIONS,
    });
}
// #endregion module



// #region exports
export default runChecker;
// #endregion exports
