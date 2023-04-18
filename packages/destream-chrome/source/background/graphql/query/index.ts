// #region imports
    // #region libraries
    import {
        gql
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
export const GET_STREAMER_SESSION = gql`
    query DestreamGetStreamerSession($input: InputValueString!) {
        destreamGetStreamerSession(input: $input) {
            status
            data {
                id
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
            }
        }
    }
`;
// #endregion module
