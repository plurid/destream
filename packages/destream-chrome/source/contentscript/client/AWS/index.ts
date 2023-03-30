// #region imports
    // #region libraries
    import {
        Amplify,
    } from '@aws-amplify/core';
    // #endregion libraries


    // #region internal
    import * as generated from './generated';
    // #endregion internal
// #endregion imports



// #region module
const aws = (
    initialConfig?: {
        endpoint: string;
        region: string;
        apiKey: string;
    },
) => {
    const config = {
        'aws_appsync_graphqlEndpoint': initialConfig?.endpoint || process.env.AWS_ENDPOINT,
        'aws_appsync_region': initialConfig?.region || process.env.AWS_REGION,
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': initialConfig?.apiKey || process.env.AWS_API_KEY,
    };

    Amplify.configure(config);

    return generated;
}
// #endregion module



// #region exports
export default aws;
// #endregion exports
