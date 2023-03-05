<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/destream/master/about/identity/destream-logo.png" height="200px">
</p>


<p align="center">
    <a href="https://chrome.google.com/webstore/detail/destream">
        <img src="https://img.shields.io/badge/chrome-v1.0.0-blue.svg?colorB=004F91&style=for-the-badge" alt="Chrome Version">
    </a>
    <a href="https://github.com/plurid/destream/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-DEL-blue.svg?colorB=492356&style=for-the-badge" alt="License">
    </a>
</p>



<h1>
    destream
</h1>


<h3>
    control web pages in the browser of followers
</h3>



## Contents

+ [About](#about)
+ [Events](#events)


## About

`destream` provides a browser extension that allows streamers to control webpages of their followers.

The streamer installs the extension and creates an account. The streamer then lists the account as a streamer account.

The followers install the extension and subscribe to the streamer's account.

The streamer activates the extension on a certain webpage and emits events (plays audio/video, likes media, etc.).

The followers receive a notification when the streamer wants to control a webpage. The followers accept the streamer's control providing the adequate control granularity, allowing full or partial control.

The streamer's events (pauses/plays/like etc.) are reproduced in the followers' browsers.

The streamer/followers can deactivate the webpage control at any time.

The stream/followers can replay previous sessions.

The streamer can delete sessions.



## Events

streamer installs destream extension
streamer creates account
streamer lists the account as streamer account

viewer installs destream extension
viewer subscribes to the streamer's account

streamer activates destream
streamer plays audio/video

viewer receives notification when streamer is playing audio/video
viewer accepts the streamer control over audio/video

streamer pauses/plays/mutes/raises volume to audio/video
viewer's audio/video is automatically updated accordingly


``` typescript
const destream = new Destream();

const channelID = await destream.newChannel();

destream.setChannel(channelID);

destream.emit('EVENT_TYPE', {data: 'value'});

destream.listen('EVENT_TYPE', (data) => {
    // handle data
});


interface DestreamEvent {
    id: string;
    type: string;
    data: string;
}

interface DestreamSession {
    channelID: string;
    events: DestreamEvent[];
}

interface DestreamChannel {
    id: string;
    sessions: DestreamSession[];
}

interface Destream {
    /**
     * Returns the channel ID if successful.
     */
    newChannel(): Promise<string | undefined>;
    /**
     * Returns true if the channel was set.
     */
    setChannel(channelID: string): boolean;
    /**
     * Returns true if the event was emitted.
     */
    emit(type: string, data: any): Promise<boolean>;
    /**
     * Returns a function to unsubscribe from the event.
     */
    listen(
        type: string,
        callback: (data: any) => void,
    ): () => void;
}
```
