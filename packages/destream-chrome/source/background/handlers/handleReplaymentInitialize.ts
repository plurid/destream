// #region imports
    // #region external
    import {
        Handler,
        ReplaymentInitializeMessage,
    } from '../../data';

    import {
        initializeReplayment,
    } from '../replayments';
    // #endregion external
// #endregion imports



// #region module
const handleReplaymentInitialize: Handler<ReplaymentInitializeMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const sessionID = request.data;

    await initializeReplayment(
        sessionID,
        () => {},
        true,
    );

    sendResponse({
        status: true,
    });
}
// #endregion module



// #region exports
export default handleReplaymentInitialize;
// #endregion exports
