// #region imports
    // #region libraries
    import Messager from '@plurid/messager';
    // #endregion libraries
// #endregion imports



// #region module
class MessagerClient {
    private messagers: Record<
        string,
        {
            id: string;
            type: 'messager';
            messager: Messager;
        } | {
            id: string;
            type: 'aws';
            aws: any;
        }
    > = {};


    constructor() {

    }


    public addMessager(
        endpoint: string,
    ) {
        // request from endpoint
        const data = {} as any;

        // generate random ID
        let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        switch (data.type) {
            case 'messager':
                const messager = new Messager(
                    data.endpoint,
                    data.token,
                    data.messagerType,
                    data.messagerOptions,
                );
                this.messagers[id] = {
                    id,
                    type: 'messager',
                    messager,
                };
                break;
            case 'sns':
                break;
        }
    }


    public async publish(
        messagerID: string,
        topic: string,
        message: any,
    ) {
        const messager = this.messagers[messagerID];
        if (!messager) {
            return;
        }

        switch (messager.type) {
            case 'messager':
                messager.messager.publish(
                    topic,
                    message,
                );
                break;
            case 'aws':
                break;
        }
    }


    public async subscribe(
        messagerID: string,
        topic: string,
        listener: any,
    ) {
        const messager = this.messagers[messagerID];
        if (!messager) {
            return;
        }

        switch (messager.type) {
            case 'messager':
                messager.messager.subscribe(
                    topic,
                    listener,
                );
                break;
            case 'aws':
                break;
        }
    }
}
// #endregion module



// #region exports
export default MessagerClient;
// #endregion exports
