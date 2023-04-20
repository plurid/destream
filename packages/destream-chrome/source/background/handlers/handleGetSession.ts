// #region imports
    // #region external
    import {
        Handler,
        GetSessionMessage,
    } from '../../data';

    import {
        getSession,
    } from '../session';
    // #endregion external
// #endregion imports



// #region module
const handleGetSession: Handler<GetSessionMessage> = async (
    request,
    sender,
    sendResponse,
) => {
    const session = await getSession(request.data || sender.tab.id);

    sendResponse({
        status: !!session,
        session,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetSession;
// #endregion exports
