// #region imports
    // #region external
    import {
        Handler,
        MessageGetSession,
        ResponseGetSession,
    } from '../../data';

    import {
        getSession,
    } from '../sessions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSession: Handler<MessageGetSession> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab?.id;
    const session = await getSession(tabID);

    const response: ResponseGetSession = {
        status: !!session,
        session,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleGetSession;
// #endregion exports
