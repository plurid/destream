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


export const debounce = <F extends Function>(
    func: F,
    timeout = 600,
) => {
    let timer: any;

    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(
            () => {
                func.apply(this, args);
            },
            timeout,
        );
    };
}

export const throttle = <F extends Function>(
    func: F,
    delay = 300,
) => {
    let shouldWait = false;
    let waitingArgs: any[] | null = null;

    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false;
        } else {
            func.apply(this, waitingArgs);
            waitingArgs = null;
            setTimeout(timeoutFunc, delay);
        }
    }

    return (...args: any[]) => {
        if (shouldWait) {
            waitingArgs = args;
            return;
        }

        func.apply(this, args);
        shouldWait = true;
        setTimeout(timeoutFunc, delay);
    }
}


export const log = (
    ...message: any[]
) => {
    if (IN_PRODUCTION) {
        return;
    }

    console.log('log', ...message);
}


export const generateRandomID = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


export const getTabIDFromKey = (
    key: string,
    prefix: string,
) => {
    return parseInt(key.replace(prefix, ''));
}



export const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
}
// #endregion module
