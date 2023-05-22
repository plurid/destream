// #region imports
    // #region external
    import {
        Handler,
    } from '../../data';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentPause: Handler<any> = async (
    request,
    _sender,
    sendResponse,
) => {
    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentPause;
// #endregion exports
