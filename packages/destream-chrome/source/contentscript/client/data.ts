// #region imports
    // #region libraries
    import Messager, {
        MessagerKind,
        MessagerOptions,
    } from '@plurid/messager';
    // #endregion libraries


    // #region internal
    import aws from './AWS';
    // #endregion internal
// #endregion imports



// #region module
export type MessagerType =
    | 'messager'
    | 'aws';


export const messagerType = {
    messager: 'messager',
    aws: 'aws',
} as const;


export type IMessagerClient =
    {
        type: typeof messagerType.messager;
        messager: Messager;
    } | {
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
// #endregion module
