// #region imports
    // #region external
    import {
        inProduction,
    } from '../data';
    // #endregion external
// #endregion imports



// #region module
export const log = (
    ...message: any[]
) => {
    if (inProduction) {
        return;
    }

    console.log(...message);
}


export const checkMessagerData = (
    data: string,
) => {
    if (!data) {
        log('checkMessagerData: no data');
        return false;
    }

    try {
        const parsedData = JSON.parse(data);

        // Ensure parsedData has correct structure.
        if (parsedData.type !== 'messager' && parsedData.type !== 'aws') {
            log('checkMessagerData: invalid type');
            return false;
        }

        if (!parsedData.endpoint) {
            log('checkMessagerData: invalid endpoint');
            return false;
        }

        if (parsedData.type === 'messager') {
            if (!parsedData.token) {
                log('checkMessagerData: invalid token');
                return false;
            }
        }

        if (parsedData.type === 'aws') {
            if (!parsedData.region || !parsedData.apiKey) {
                log('checkMessagerData: invalid region or apiKey');
                return false;
            }
        }

        return true;
    } catch (error) {
        log('checkMessagerData: error', error);
        return false;
    }
}
// #endregion module
