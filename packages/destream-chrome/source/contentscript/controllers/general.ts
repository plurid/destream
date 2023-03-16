// #region module
export const generalScrollTo = (
    top: number,
    left: number = 0
) => {
    window.scrollTo({
        top,
        left,
        behavior: 'smooth',
    });
}
// #endregion module
