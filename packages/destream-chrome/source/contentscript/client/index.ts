// #region imports
    // #region libraries
    import Messager from '@plurid/messager';
    // #endregion libraries


    // #region internal
    import aws from './AWS';
    // #endregion internal
// #endregion imports



// #region module
class MessagerClient {
    private clients: Record<
        string,
        {
            id: string;
            type: 'messager';
            messager: Messager;
        } | {
            id: string;
            type: 'aws';
            aws: ReturnType<typeof aws>;
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
                this.clients[id] = {
                    id,
                    type: 'messager',
                    messager,
                };
                break;
            case 'aws':
                this.clients[id] = {
                    id,
                    type: 'aws',
                    aws: aws({
                        endpoint: data.endpoint,
                        region: data.region,
                        apiKey: data.apiKey,
                    }),
                };
                break;
        }
    }


    public async publish(
        messagerID: string,
        topic: string,
        message: any,
    ) {
        const client = this.clients[messagerID];
        if (!client) {
            return;
        }

        switch (client.type) {
            case 'messager':
                client.messager.publish(
                    topic,
                    message,
                );
                break;
            case 'aws':
                client.aws.publish(
                    topic,
                    message,
                );
                break;
        }
    }


    public async subscribe(
        messagerID: string,
        topic: string,
        listener: (message: any) => void,
    ) {
        const client = this.clients[messagerID];
        if (!client) {
            return;
        }

        switch (client.type) {
            case 'messager':
                client.messager.subscribe(
                    topic,
                    listener,
                );
                break;
            case 'aws':
                client.aws.subscribe(
                    topic,
                    (data) => {
                        try {
                            const message = JSON.parse(data.data);
                            listener(message);
                        } catch (error) {
                            return;
                        }
                    },
                );
                break;
        }
    }
}
// #endregion module



// #region exports
export default MessagerClient;
// #endregion exports
