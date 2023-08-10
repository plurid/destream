// #region imports
    // #region libraries
    import delog from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        IN_PRODUCTION,
        IN_TRACING,
        DESTREAM_PROTOCOL,
        DELOG_ENDPOINT,
        DELOG_TOKEN,
        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
    } from '~data/constants';

    import {
        MessageGetGeneralPermissions,
        ResponseGetGeneralPermissions,
    } from '~data/interfaces';

    import {
        getGeneralPermissions,
    } from '~background/utilities';


    import {
        sendMessage,
    } from '../messaging';
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



class Telemetry {
    private useTelemetry = false;

    constructor() {
        this.load();
    }

    private async load() {
        if (typeof window !== 'undefined') {
            sendMessage<MessageGetGeneralPermissions, ResponseGetGeneralPermissions>(
                {
                    type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_GENERAL_PERMISSIONS,
                },
                (response) => {
                    if (response.status) {
                        this.useTelemetry = response.generalPermissions.useTelemetry;
                    }
                },
            );
            return;
        }

        const generalPermissions = await getGeneralPermissions();
        if (!generalPermissions) {
            return;
        }

        this.useTelemetry = generalPermissions.useTelemetry;
    }

    public get() {
        return this.useTelemetry;
    }
}

const telemetry = new Telemetry();

export const log = (
    ...message: any[]
) => {
    if (IN_PRODUCTION) {
        const useTelemetry = telemetry.get();

        if (useTelemetry) {
            if (!DELOG_ENDPOINT || !DELOG_TOKEN) {
                return;
            }

            delog({
                endpoint: DELOG_ENDPOINT,
                token: DELOG_TOKEN,
                level: 'error',
                text: 'destream',
                extradata: JSON.stringify(message),
            });
        }

        return;
    }

    console.log('destream ::', ...message);
}

export const trace = (
    ...message: any[]
) => {
    if (IN_PRODUCTION || !IN_TRACING) {
        return;
    }

    console.log('trace ::', ...message);
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



export const destreamIDGetValue = (
    id: string,
) => (
    id.trim().replace(DESTREAM_PROTOCOL, '')
);

export const destreamIDGetDisplay = (
    id: string,
) => (
    DESTREAM_PROTOCOL + destreamIDGetValue(id)
);
// #endregion module



// #region exports
export * from '../specifics/utilities';
// #endregion exports
