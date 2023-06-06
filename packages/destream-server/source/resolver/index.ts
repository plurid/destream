// #region imports
    // #region external
    import {
        messagerData,
        ResponseDestreamMessagerData,
    } from '../data';

    import {
        checkMessagerData,
    } from '../utilities';
    // #endregion external
// #endregion imports



// #region module
export const destreamGetMessagerData = async (): Promise<ResponseDestreamMessagerData> => {
    const validMessagerData = checkMessagerData(messagerData);
    if (!validMessagerData) {
        return {
            status: false,
            errors: [
                {
                    type: 'no-data',
                    path: 'destreamGetMessagerData',
                    message: 'No data available.',
                },
            ],
        };
    }

    return {
        status: true,
        data: messagerData,
    };
}
// #endregion module
