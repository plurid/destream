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
+ [Custom Destream Server](#custom-destream-server)


## About

`destream` is a browser extension for streamers and generally content creators to indirectly control web pages in their audience's browser, either live or as a destream session replay or through a linkage.

<p align="center">
    <img src="https://raw.githubusercontent.com/plurid/destream/master/about/images/ss.png" height="500px">
</p>

The content creator installs the extension, creates an [account](https://account.plurid.com), and registers as a streamer. The audience installs the extension and subscribes to the streamer. The streamer activates the extension on certain web pages and starts streaming events (plays audio/video, scrolls the page, reacts to media, etc.).

The audience receives a notification when the streamer wants to control a web page and accepts the streamer's control providing the adequate control granularity, allowing full or partial control.

The streamer's events (pause/play/URL change/like and so on) are reproduced in the audience's browsers. The streamer never gets to see the actual web page of the audience, all they get to do is to interact with their own web page in their browser and stream the events.

The streamer/audience can deactivate the web page control at any time and can replay previous sessions. The streamer can edit/delete completed sessions and they can be replayed accordingly.

The streamer/audience can explore previous sessions on [destream.plurid.com](https://destream.plurid.com).



## Custom Destream Server

As a streamer you can [register](https://account.plurid.com/destream) a custom destream server which will allow your audience to connect to different publish/subscribe mechanisms ([self-hosted messager](https://github.com/plurid/messager), [AWS AppSync](https://aws.amazon.com/appsync)) without requiring a [destream subscription](https://plurid.com/destream).

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

// e.g.

JSON.stringify({
    type: 'messager',
    endpoint: '<messager-url>',
    token: '<token-value>',
    messagerKind: 'socket',
    messagerOptions: {
        secure: true // recommended with an endpoint using WSS
    }
});
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
