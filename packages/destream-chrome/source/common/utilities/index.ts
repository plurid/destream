// #region imports
    // #region external
    import {
        IN_PRODUCTION,
    } from '../../data/constants';
    // #endregion external
// #endregion imports



// #region module
export const retryGet = async <T>(
    getter: () => T | undefined,
    timeout = 100,
    count = 100,
) => {
    let retryCount = 0;

    while (!getter()) {
        retryCount += 1;

        await new Promise(resolve => setTimeout(resolve, timeout));

        if (retryCount > count) {
            return;
        }
    }

    return getter();
}


export function debounce(
    func: any,
    timeout = 600,
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


export const log = (
    message: any,
) => {
    if (IN_PRODUCTION) {
        return;
    }

    console.log('log', message);
}
// #endregion module
