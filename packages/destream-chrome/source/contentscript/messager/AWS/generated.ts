import { API, graphqlOperation } from '@aws-amplify/api'



export const subscribeDoc = /* GraphQL */ `
    subscription Subscribe($name: String!) {
        subscribe(name: $name) {
            data
            name
        }
    }
`

export const publishDoc = /* GraphQL */ `
    mutation Publish($data: AWSJSON!, $name: String!) {
        publish(data: $data, name: $name) {
            data
            name
        }
    }
`

/**
 * @param  {string} name the name of the channel
 * @param  {Object} data the data to publish to the channel
 */
export async function publish(name: any, data: any) {
    return await API.graphql(graphqlOperation(publishDoc, { name, data }))
}

/**
 * @param  {string} name the name of the channel
 * @param  {nextCallback} next callback function that will be called with subscription payload data
 * @param  {function} [error] optional function to handle errors
 * @returns {Observable} an observable subscription object
 */
export function subscribe(name: any, next: any, error?: any) {
    return (API.graphql(graphqlOperation(subscribeDoc, { name })) as any).subscribe({
        next: ({ provider, value }: any) => {
            next(value.data.subscribe, provider, value)
        },
        error: error || console.log,
    })
}

/**
 * @callback nextCallback
 * @param {Object} data the subscription response including the `name`, and `data`.
 * @param {Object} [provider] the provider object
 * @param {Object} [payload] the entire payload
 */
