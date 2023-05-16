// #region imports
    // #region external
    import {
        Handler,
        ReplaySessionMessage,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleReplaySession: Handler<ReplaySessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const reject = () => {
        sendResponse({
            status: false,
        });
    }

    reject();
}
// #endregion module



// #region exports
export default handleReplaySession;
// #endregion exports
