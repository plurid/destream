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
    // #endregion external


    // #region internal
    import {
        LinkageController,
    } from './controllers';

    import {
        linkageEventMap,
    } from './data';
    // #endregion internal
// #endregion imports



// #region module
const getController = (
    data: DestreamLinkage,
): LinkageController => {
    return new LinkageController(data);
}


const runLinkage = async () => {
    let setup = false;
    let linkage: DestreamLinkage | undefined;
    let linkageController: LinkageController | undefined;


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
