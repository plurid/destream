// #region imports
    // #region external
    import {
        MESSAGE_TYPE,
        Message,
        GetLinkageMessage,
        DestreamLinkage,
    } from '../../data';

    import {
        sendMessage,
    } from '../../common/messaging';

    import MessagerClient from '../client';

    import {
        checkNetflixOrigin,
    } from '../utilities/netflix';

    import {
        checkSpotifyOrigin,
    } from '../utilities/spotify';

    import {
        checkTwitchOrigin,
    } from '../utilities/twitch';

    import {
        checkYoutubeOrigin,
    } from '../utilities/youtube';
    // #endregion external


    // #region internal
    import {
        Controller,
        GeneralLinkage,
    } from './controllers';

    import {
        YoutubeLinkage,
    } from './controllers/youtube';
    // #endregion internal
// #endregion imports



// #region module
const getController = (
    data: DestreamLinkage,
): Controller => {
    // if (checkNetflixOrigin()) return new NetflixLinkage();
    // if (checkSpotifyOrigin()) return new SpotifyLinkage();
    // if (checkTwitchOrigin()) return new TwitchLinkage();
    if (checkYoutubeOrigin()) return new YoutubeLinkage(data);

    return new GeneralLinkage(data);
}


const runLinkage = async (
    client: MessagerClient,
) => {
    let setup = false;
    let linkage: DestreamLinkage | undefined;
    let linkageController: Controller | undefined;


    const checkTabSettings = (
        changes: { [key: string]: chrome.storage.StorageChange },
    ) => {

    }

    const messageListener = (
        request: Message,
        _sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void,
    ) => {
        if (!linkage || !linkageController) {
            sendResponse();
            return true;
        }

        switch (request.type) {
            case MESSAGE_TYPE.LINKAGE_STARTING:
                if (request.data !== linkage.id) break;
                linkageController.eventer.dispatchEvent('beforeStart');
                break;
            case MESSAGE_TYPE.LINKAGE_STARTED:
                if (request.data !== linkage.id) break;
                linkageController.eventer.dispatchEvent('afterStart');
                break;
            case MESSAGE_TYPE.LINKAGE_ENDED:
                if (request.data !== linkage.id) break;
                linkageController.eventer.dispatchEvent('afterEnd');
                break;
        }

        sendResponse();
        return true;
    }


    const run = async () => {
        const linkageRequest = await sendMessage<GetLinkageMessage>({
            type: MESSAGE_TYPE.GET_LINKAGE,
        });
        if (!linkageRequest.status) {
            return;
        }

        if (setup) {
            return;
        } else {
            setup = true;
        }

        linkage = linkageRequest.linkage;
        linkageController = getController(linkage);
    }


    await run();

    const storageLogic = async (
        changes: { [key: string]: chrome.storage.StorageChange },
    ) => {
        checkTabSettings(changes);

        await run();
    }


    chrome.storage.onChanged.addListener(storageLogic);
    chrome.runtime.onMessage.addListener(messageListener);
}
// #endregion module



// #region exports
export default runLinkage;
// #endregion exports
