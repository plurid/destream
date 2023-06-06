// #region module
export const port = parseInt(process.env.PORT || '') || 45321;

export const messagerData = process.env.DESTREAM_MESSAGER_DATA || '';


export interface ResponseDestreamMessagerData {
    status: boolean;
    errors?: {
        type: string;
        path: string;
        message: string;
    }[];
    data?: string;
}
// #endregion module
