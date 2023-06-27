// #region imports
    // #region external
    import {
        Message,
        MessageGetLinkage,
        ResponseGetLinkage,
        DestreamLinkage,

        MESSAGE_CONTENTSCRIPT_TO_BACKGROUND,
        ASYNCHRONOUS_RESPONSE,
    } from '~data/index';

    import {
        sendMessage,
        messageAddListener,
    } from '~common/messaging';

    import {
        storageAddListener,
    } from '~common/storage';

    import {
        StorageChange,
        MessageListener,
    } from '~common/types';

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
        NetflixLinkage,
    } from './controllers/netflix';

    import {
        SpotifyLinkage,
    } from './controllers/spotify';

    import {
        TwitchLinkage,
    } from './controllers/twitch';

    import {
        YoutubeLinkage,
    } from './controllers/youtube';

    import {
        linkageEventMap,
    } from './data';
    // #endregion internal
// #endregion imports



// #region module
const getController = (
    data: DestreamLinkage,
): Controller => {
    if (checkNetflixOrigin()) return new NetflixLinkage(data);
    if (checkSpotifyOrigin()) return new SpotifyLinkage(data);
    if (checkTwitchOrigin()) return new TwitchLinkage(data);
    if (checkYoutubeOrigin()) return new YoutubeLinkage(data);

    return new GeneralLinkage(data);
}


const runLinkage = async () => {
    let setup = false;
    let linkage: DestreamLinkage | undefined;
    let linkageController: Controller | undefined;


    const messageListener: MessageListener<Message, any> = (
        request,
        _sender,
        sendResponse,
    ) => {
        if (!linkage || !linkageController) {
            sendResponse();
            return ASYNCHRONOUS_RESPONSE;
        }

        const event = linkageEventMap[request.type];
        // FORCED
        const requestData = (request as any).data;
        if (!event || requestData !== linkage.id) {
            sendResponse();
            return ASYNCHRONOUS_RESPONSE;
        }

        linkageController.eventer.dispatchEvent(event);

        sendResponse();
        return ASYNCHRONOUS_RESPONSE;
    }


    const run = async () => {
        const linkageRequest = await sendMessage<MessageGetLinkage, ResponseGetLinkage>({
            type: MESSAGE_CONTENTSCRIPT_TO_BACKGROUND.GET_LINKAGE,
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
        _changes: { [key: string]: StorageChange },
    ) => {
        await run();
    }


    storageAddListener(storageLogic);
    messageAddListener(messageListener);
}
// #endregion module



// #region exports
export default runLinkage;
// #endregion exports
