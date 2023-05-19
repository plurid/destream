// #region imports
    // #region libraries
    import {
        gql,
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
                    zones {
                        com {
                            tools {
                                destream {
                                    isStreamer
                                    streamerDetails {
                                        streamerName
                                        twitchName
                                        youtubeName
                                    }
                                    access {
                                        role
                                        subscription {
                                            active
                                            start
                                            end
                                            canceled
                                            plan
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                tokens {
                    access
                    refresh
                }
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
            data {
                id
                token
                customPubSubLink
            }
        }
    }
`;

export const STOP_SESSION = gql`
    mutation DestreamStopSession($input: InputValueString!) {
        destreamStopSession(input: $input) {
            status
        }
    }
`;

export const START_SESSION_SUBSCRIPTION = gql`
    mutation DestreamStartSessionSubscription($input: InputValueString!) {
        destreamStartSessionSubscription(input: $input) {
            status
            data
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
