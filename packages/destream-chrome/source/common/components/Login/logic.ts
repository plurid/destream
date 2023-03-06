// #region module
export const loginLogic = async (
    identonym: string,
    key: string,
) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    return true;
}
// #endregion module
