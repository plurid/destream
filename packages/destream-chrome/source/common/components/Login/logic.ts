// #region imports
    // #region external
    import {
        generateClient,
        LOGIN_BY_IDENTONYM,
    } from '~background/graphql';

    import {
        login,
    } from '../../logic';
    // #endregion external
// #endregion imports



// #region module
export const hashKey = async (
    key: string,
) => {
    return crypto.subtle.digest(
        'SHA-512',
        new TextEncoder().encode(key),
    ).then(buf => {
        return Array.prototype.map.call(
            new Uint8Array(buf),
            (x: any) => (('00' + x.toString(16)).slice(-2)),
        ).join('');
    });
}


export const loginLogic = async (
    identonym: string,
    key: string,
) => {
    try {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        const client = generateClient();
        const keyHash = await hashKey(key);
        const request = await client.mutate({
            mutation: LOGIN_BY_IDENTONYM,
            variables: {
                input: {
                    identonym,
                    key: keyHash,
                },
            },
        });
        const response = request.data.loginByIdentonym;

        if (!response.status) {
            return false;
        }

        const {
            owner,
            tokens,
        } = response.data;
        const {
            destream,
        } = owner.zones.com.tools;

        await login(
            identonym,
            tokens,
            destream,
        );

        return true;
    } catch (error) {
        return false;
    }
}
// #endregion module
