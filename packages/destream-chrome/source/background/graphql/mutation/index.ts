// #region imports
    // #region libraries
    import {
        gql
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
export const LOGIN_BY_IDENTONYM = gql`
    mutation LoginByIdentonym($input: InputLoginByIdentonym!) {
        loginByIdentonym(input: $input) {
            status
            data {
                owner {
                    id
                    identonym
                }
                ssoToken
            }
            errors {
                path
                message
                type
            }
        }
    }
`;


export const LOGOUT = gql`
    mutation Logout {
        logout {
            status
        }
    }
`;


export const START_SESSION = gql`
    mutation DestreamStartSession($input: InputDestreamStartSession!) {
        destreamStartSession(input: $input) {
            status
        }
    }
`;

export const STOP_SESSION = gql`
    mutation DestreamStopSession($input: InputDestreamStopSession!) {
        destreamStopSession(input: $input) {
            status
        }
    }
`;

export const START_SESSION_SUBSCRIPTION = gql`
    mutation DestreamStartSessionSubscription($input: InputDestreamStartSessionSubscription!) {
        destreamStartSessionSubscription(input: $input) {
            status
        }
    }
`;

export const STOP_SESSION_SUBSCRIPTION = gql`
    mutation DestreamStopSessionSubscription($input: InputDestreamStopSessionSubscription!) {
        destreamStopSessionSubscription(input: $input) {
            status
        }
    }
`;


export const RECORD_SESSION_EVENT = gql`
    mutation DestreamRecordSessionEvent($input: InputDestreamRecordSessionEvent!) {
        destreamRecordSessionEvent(input: $input) {
            status
        }
    }
`;
// #endregion module
