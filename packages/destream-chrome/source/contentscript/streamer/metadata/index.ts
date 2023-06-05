// #region module
export class DestreamMetadata {
    private streamCursor = false;

    getStreamCursor() {
        return this.streamCursor;
    }

    setStreamCursor(
        value: boolean,
    ) {
        this.streamCursor = value;
    }
}

export const metadata = new DestreamMetadata();
// #endregion module



// #region exports
export default metadata;
// #endregion exports
