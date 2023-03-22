/**
 * Make service worker persistent
 * https://github.com/guest271314/persistent-serviceworker/blob/main/chromium_extension_externally_connectable/background.js
 */


const start = new Date();


function handleMessage(e: any) {
    console.log(e);
}
function handleDisconnect(resolve: any) {
    (self as any).externalPort.onMessage.removeListener(handleMessage);
    (self as any).externalPort.onDisconnect.removeListener(handleDisconnect);
    (self as any).externalPort = null;
    resolve();
}
async function* active(id: any) {
    while (true) {
        yield new Promise((resolve) => {
            (self as any).externalPort = chrome.runtime.connect(id, {
                name: 'active',
            });
            (self as any).externalPort.onMessage.addListener(handleMessage);
            (self as any).externalPort.onDisconnect.addListener(
                handleDisconnect.bind(null, resolve)
            );
        });
    }
}
async function stream(id: any) {
    for await (const _ of active(id)) {
    }
}

async function persistentExternalConnection(id: any) {
    if (!(self as any).externalPort) {
        stream(id);
    } else {
        (self as any).externalPort.disconnect();
        (self as any).externalPort = null;
    }
}

chrome.action.onClicked.addListener(async (tab) => {
    // TODO: Dynamically update "externally_connectable" in manifest.json
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id,
        },
        world: 'MAIN',
        args: [chrome.runtime.id],
        func: persistentExternalConnection,
    });
});

let port: any;

export async function handleConnectExternal(_: any) {
    port = _;
    const time = new Date();

    function handleMessage(e: any) {
        console.log(e);
    }
    function handleDisconnect(e: any) {
        console.log(e);
        port.onMessage.removeListener(handleMessage);
        port.onDisconnect.removeListener(handleDisconnect);
        port = null;
    }

    port.onMessage.addListener(handleMessage);
    port.onDisconnect.addListener(handleDisconnect);

    while (port && ((new Date() as any) - (time as any)) / 60000 < 1) {
        if (port) {
            const now = new Date();
            port.postMessage({
                start,
                now,
                time,
                active: ((new Date() as any) - (time as any)) / 60000 < 1,
                minutes: ((now as any) - (start as any)) / 60000,
            });
            await new Promise((resolve) => setTimeout(resolve, 100));
        } else {
            break;
        }
    }

    if (port) {
        const now = new Date();
        port.postMessage({
            start,
            now,
            time,
            active: ((new Date() as any) - (time as any)) / 60000 < 1,
            minutes: ((now as any) - (start as any)) / 60000,
        });
        port.disconnect();
        port.onMessage.removeListener(handleMessage);
        port.onDisconnect.removeListener(handleDisconnect);
        port = null;
    }
}
