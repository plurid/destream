<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/destream/master/about/identity/destream-logo.png" height="200px">
</p>


<p align="center">
    <a href="https://chrome.google.com/webstore/detail/destream">
        <img src="https://img.shields.io/badge/chrome-v1.0.0-blue.svg?colorB=004F91&style=for-the-badge" alt="Chrome Version">
    </a>
    <a href="https://github.com/plurid/destream/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-DEL-blue.svg?colorB=1380C3&style=for-the-badge" alt="License">
    </a>
</p>



<h1>
    destream
</h1>


<h3>
    collaborative browsing: as streamer—control pages in the browser of your audience; as viewer—let streamers control pages in your browser
</h3>



## Contents

+ [About](#about)
+ [Events](#events)


## About

`destream` is a browser extension that allows streamers to control web pages in their audience's browser.

The streamer installs the extension and creates an account and lists it as a streamer account. The audience installs the extension and subscribe to the streamer's account. The streamer activates the extension on a certain webpage and emits events (plays audio/video, scrolls the page, reacts to media, etc.).

The audience receives a notification when the streamer wants to control a webpage and accepts the streamer's control providing the adequate control granularity, allowing full or partial control.

The streamer's events (pauses/plays/like etc.) are reproduced in the audience's browsers. The streamer/audience can deactivate the web page control at any time and can replay previous sessions. The streamer can edit/delete sessions.


## Custom Destream Server

As a streamer you can [register](https://account.plurid.com/destream) a custom destream server which will allow your audience to connect to different publish/subscribe mechanisms ([self-hosted messager](https://github.com/plurid/messager), [AWS AppSync](https://aws.amazon.com/appsync)).

The simplest way to run a custom destream server is to use the [docker image](https://hub.docker.com/r/plurid/destream-server).

``` bash
docker pull plurid/destream-server

docker run -d -p 45321:8080 -e DESTREAM_MESSAGER_DATA=$DESTREAM_MESSAGER_DATA plurid/destream-server
```

where `$DESTREAM_MESSAGER_DATA` is a stringified JSON object respecting the interface

``` typescript
interface SelfHostedMessager {
    type: ‘messager’;
    endpoint: string;
    token: string;
    messagerKind?: MessagerKind;
    messagerOptions?: MessagerOptions;
}

// or

interface AWSAppSync {
    type: ‘aws’;
    endpoint: string;
    region: string;
    apiKey: string;
}
```

expose then the port `45321` to the internet and register the server URL in the [destream account](https://account.plurid.com/destream).

After server registration, starting a destream session will send the server URL to the audience, which will query the server for the `MessagerData` and connect to it.

``` graphql
query DestreamGetMessagerData {
    destreamGetMessagerData {
        status
        data
    }
}
```

In order to customize the destream server, the repository can be cloned

``` bash
git clone https://github.com/plurid/destream.git

cd destream/packages/destream-server

npm install
```

and the function `destreamGetMessagerData` in `source/resolver/index.ts` can be edited acordingly.

The server can then be recontainerized running

``` bash
npm run containerize
```
