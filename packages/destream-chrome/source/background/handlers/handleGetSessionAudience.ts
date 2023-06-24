// #region imports
    // #region external
    import {
        Handler,
        MessageGetSessionAudience,
        ResponseGetSessionAudience,
    } from '../../data';

    import {
        getSessionAudience,
    } from '../sessions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSessionAudience: Handler<MessageGetSessionAudience> = async (
    request,
    _sender,
    sendResponse,
) => {
    const audienceResponse = await getSessionAudience(request.data);

    const response: ResponseGetSessionAudience = {
        status: audienceResponse.status,
        audience: audienceResponse.data,
    };
    sendResponse(response);

    return;
}
// #endregion module



// #region exports
export default handleGetSessionAudience;
// #endregion exports
