// #region imports
    // #region libraries
    import Messager from '@plurid/messager';
    // #endregion libraries


    // #region internal
    import aws from './AWS';

    import {
        IMessagerClient,
        messagerType,
    } from './data';

    import {
        requestClientEndpointData,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
class MessagerClient {
    private clients: Record<string, IMessagerClient> = {};


    constructor() {
    }


    public async addMessager(
        endpoint: string,
    ) {
        if (this.clients[endpoint]) {
            return;
        }

        const data = await requestClientEndpointData(endpoint);
        if (!data) {
            return;
        }

        switch (data.type) {
            case messagerType.messager:
                this.clients[endpoint] = {
                    type: messagerType.messager,
                    messager: new Messager(
                        data.endpoint,
                        data.token,
                        data.messagerKind,
                        data.messagerOptions,
                    ),
                };
                break;
            case messagerType.aws:
                this.clients[endpoint] = {
                    type: messagerType.aws,
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
            case messagerType.messager:
                client.messager.publish(
                    topic,
                    message,
                );
                break;
            case messagerType.aws:
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
            case messagerType.messager:
                client.messager.subscribe(
                    topic,
                    listener,
                );
                break;
            case messagerType.aws:
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

    public async unsubscribe(
        messagerID: string,
        topic: string,
    ) {
        const client = this.clients[messagerID];
        if (!client) {
            return;
        }

        switch (client.type) {
            case messagerType.messager:
                client.messager.unsubscribe(
                    topic,
                );
                break;
            case messagerType.aws:
                break;
        }
    }

    public close() {
        for (const [id, client] of Object.entries(this.clients)) {
            switch (client.type) {
                case messagerType.messager:
                    client.messager.close();
                    break;
                case messagerType.aws:
                    break;
            }

            delete this.clients[id];
        }

        this.clients = {};
    }
}
// #endregion module



// #region exports
export default MessagerClient;
// #endregion exports
