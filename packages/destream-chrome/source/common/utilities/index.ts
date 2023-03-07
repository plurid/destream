// #region module
export const retryGet = async <T>(
    getter: () => T | undefined,
) => {
    let retryCount = 0;

    while (!getter()) {
        retryCount += 1;

        await new Promise(resolve => setTimeout(resolve, 100));

        if (retryCount > 100) {
            return;
        }
    }

    return getter();
}


export function debounce(
    func: any,
    timeout = 700,
) {
    let timer: any;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(
            () => {
                func.apply(this, args);
            },
            timeout,
        );
    };
}
// #endregion module
