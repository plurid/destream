// #region imports
    // #region libraries
    import Messager from '@plurid/messager';
    // #endregion libraries


    // #region external
    import {
        DEFAULT_MESSAGER_ENDPOINT,
        DEFAULT_MESSAGER_TOKEN,

        defaultMessager,
        messagerType,
        messagerOptions,
    } from '../../data/constants';
    // #endregion external
// #endregion imports



// #region module
export class MessagerManager {
    private messagers: Record<string, Messager> = {};


    constructor() {
        try {
            this.messagers[defaultMessager] = new Messager(
                DEFAULT_MESSAGER_ENDPOINT,
                DEFAULT_MESSAGER_TOKEN,
                messagerType,
                messagerOptions,
            );
        } catch (error) {
            console.log('Could not initialize default messager.');
        }
    }


    public new(
        endpoint: string,
        token: string,
    ) {
        this.messagers[endpoint] = new Messager(
            endpoint,
            token,
            messagerType,
            messagerOptions,
        );
    }

    public remove(
        endpoint: string,
    ) {
        delete this.messagers[endpoint];
    }


    public get(
        endpoint?: string,
    ) {
        if (!endpoint || !this.messagers[endpoint]) {
            return this.messagers[defaultMessager];
        }

        return this.messagers[endpoint];
    }
}


const messagerManager = new MessagerManager();
// #endregion module



// #region exports
export default messagerManager;
// #endregion exports
