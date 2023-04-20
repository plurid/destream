// #region imports
    // #region libraries
    import Messager, {
        MessagerKind,
        MessagerOptions,
    } from '@plurid/messager';
    // #endregion libraries


    // #region external
    import {
        generateRandomID,
    } from '../../common/utilities';
    // #endregion external


    // #region internal
    import aws from './AWS';
    // #endregion internal
// #endregion imports



// #region module
export type MessagerType = 'messager' | 'aws';

export const messagerType = {
    messager: 'messager',
    aws: 'aws',
} as const;

export type IMessagerClient =
    {
        id: string;
        type: typeof messagerType.messager;
        messager: Messager;
    } | {
        id: string;
        type: typeof messagerType.aws;
        aws: ReturnType<typeof aws>;
    };

export type MessagerData =
    {
        type: typeof messagerType.messager;
        endpoint: string;
        token: string;
        messagerKind?: MessagerKind;
        messagerOptions?: MessagerOptions;
    } | {
        type: typeof messagerType.aws;
        endpoint: string;
        region: string;
        apiKey: string;
    };


const requestClientEndpointData = async (
    endpoint: string,
): Promise<MessagerData | undefined> => {
    // request from endpoint

    // const data = {
    //     type: messagerType.aws,
    //     endpoint: '',
    //     region: '',
    //     apiKey: '',
    // } as MessagerData;

    const data = {
        type: messagerType.messager,
        endpoint: '',
        token: '',
        // messagerKind: 'socket',
        // messagerOptions: {},
    } as MessagerData;

    return data;
}



class MessagerClient {
    private clients: Record<string, IMessagerClient> = {};


    constructor() {
    }


    public async addMessager(
        endpoint: string,
    ) {
        const data = await requestClientEndpointData(endpoint);
        if (!data) {
            return;
        }
        const id = generateRandomID();

        switch (data.type) {
            case messagerType.messager:
                this.clients[id] = {
                    id,
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
                this.clients[id] = {
                    id,
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
}
// #endregion module



// #region exports
export default MessagerClient;
// #endregion exports
