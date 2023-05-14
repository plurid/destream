// #region module
export const generalScrollTo = (
    top: number,
    left: number = 0,
) => {
    window.scrollTo({
        top,
        left,
        behavior: 'smooth',
    });
}


export const generalURLChange = (
    url: string,
) => {
    location.href = url;
}
// #endregion module
