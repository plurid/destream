// #region imports
    // #region external
    import {
        Handler,
        GetSessionAudienceMessage,
    } from '../../data';

    import {
        getSessionAudience,
    } from '../sessions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSessionAudience: Handler<GetSessionAudienceMessage> = async (
    request,
    _sender,
    sendResponse,
) => {
    const response = await getSessionAudience(request.data);

    sendResponse({
        status: response.status,
        data: response.data,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetSessionAudience;
// #endregion exports
