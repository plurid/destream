// #region module
export const checkMessagerData = (
    data: string,
) => {
    if (!data) {
        return false;
    }

    try {
        const parsedData = JSON.parse(data);

        // Ensure parsedData has correct structure.
        if (parsedData.type !== 'messager' || parsedData.type !== 'aws') {
            return false;
        }

        if (!parsedData.endpoint) {
            return false;
        }

        if (parsedData.type === 'messager') {
            if (!parsedData.token) {
                return false;
            }
        }

        if (parsedData.type === 'aws') {
            if (!parsedData.region || !parsedData.apiKey) {
                return false;
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}
// #endregion module
