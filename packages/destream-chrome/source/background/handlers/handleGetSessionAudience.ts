// #region imports
    // #region external
    import {
        Handler,
        MessageGetSessionAudience,
        ResponseGetSessionAudience,
    } from '~data/interfaces';

    import {
        getSessionAudience,
    } from '../sessions';
    // #endregion external
// #endregion imports



// #region module
const handleGetSessionAudience: Handler<MessageGetSessionAudience, ResponseGetSessionAudience> = async (
    request,
    _sender,
    sendResponse,
) => {
    const audienceResponse = await getSessionAudience(request.data);

    sendResponse({
        status: audienceResponse.status,
        audience: audienceResponse.data,
    });

    return;
}
// #endregion module



// #region exports
export default handleGetSessionAudience;
// #endregion exports
