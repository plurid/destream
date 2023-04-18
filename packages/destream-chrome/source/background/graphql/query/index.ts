// #region imports
    // #region libraries
    import {
        gql
    } from '@apollo/client';
    // #endregion libraries
// #endregion imports



// #region module
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
