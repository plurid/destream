// #region imports
    // #region libraries
    import {
        gql,
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
export const GET_ACTIVE_SESSIONS = gql`
    query DestreamGetActiveSessions($input: InputValueString!) {
        destreamGetActiveSessions(input: $input) {
            status
            data {
                streamerDetails {
                    streamerName
                    twitchName
                    useTwitch
                    useYoutube
                    youtubeName
                }
                sessions {
                    id
                    url
                    incognito
                    generatedAt
                    status
                    events {
                        relativeTime
                        data
                    }
                    customPubSubLink
                }
            }
        }
    }
`;

export const GET_ACTIVE_SESSION = gql`
    query DestreamGetActiveSession($input: InputValueString!) {
        destreamGetActiveSession(input: $input) {
            status
            data {
                streamerDetails {
                    streamerName
                    twitchName
                    useTwitch
                    useYoutube
                    youtubeName
                }
                session {
                    id
                    url
                    incognito
                    generatedAt
                    status
                    events {
                        relativeTime
                        data
                    }
                    customPubSubLink
                }
            }
        }
    }
`;

export const GET_SESSION = gql`
    query DestreamGetSession($input: InputValueString!) {
        destreamGetSession(input: $input) {
            status
            data {
                id
                generatedAt
                title
                url
                incognito
                status
                events {
                    relativeTime
                    data
                }
                stoppedAt
            }
        }
    }
`;

export const GET_SESSION_AUDIENCE = gql`
    query DestreamGetSessionAudience($input: InputValueString!) {
        destreamGetSessionAudience(input: $input) {
            status
            data
        }
    }
`;


export const GET_MESSAGER_DATA = gql`
    query DestreamGetMessagerData {
        destreamGetMessagerData {
            status
            data
        }
    }
`;
// #endregion module
