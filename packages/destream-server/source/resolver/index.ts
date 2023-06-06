// #region imports
    // #region external
    import {
        messagerData,
        ResponseDestreamMessagerData,
    } from '../data';
    // #endregion external
// #endregion imports



// #region module
export const destreamGetMessagerData = async (): Promise<ResponseDestreamMessagerData> => {
    if (!messagerData) {
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
