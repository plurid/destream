// #region imports
    // #region external
    import {
        Handler,
        MessageGetSession,
        ResponseGetSession,
    } from '~data/interfaces';

    import {
        getSession,
    } from '../sessions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSession: Handler<MessageGetSession, ResponseGetSession> = async (
    request,
    sender,
    sendResponse,
) => {
    const tabID = request.data || sender.tab?.id;
    if (!tabID) {
        sendResponse({
            status: false,
        });
        return;
    }

    const session = await getSession(tabID);
    if (!session) {
        sendResponse({
            status: false,
        });
        return;
    }

    sendResponse({
        status: true,
        session,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetSession;
// #endregion exports
