// #region imports
    // #region libraries
    import {
        Amplify,
    } from '@aws-amplify/core';
    // #endregion libraries


    // #region internal
    import * as gen from './generated';
    // #endregion internal
// #endregion imports



// #region module
const run = async () => {
    // get config from the network
    const networkConfig = {
        endpoint: process.env.AWS_ENDPOINT,
        region: process.env.AWS_REGION,
        apiKey: process.env.AWS_API_KEY,
    };

    const config = {
        'aws_appsync_graphqlEndpoint': networkConfig.endpoint,
        'aws_appsync_region': networkConfig.region,
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': networkConfig.apiKey,
    };

    Amplify.configure(config);


    let channel = 'channel';

    console.log('subscribed?');
    gen.subscribe(
        channel,
        (subscription: any, provider: any, value: any) => {
            console.log({
                subscription,
                provider,
                value,
            });
        },
    );


    setTimeout(async () => {
        console.log('published?');
        const send = '{ "one": "twothreefour" }';
        await gen.publish(channel, send);
    }, 2_000);
}


run();
// #endregion module
