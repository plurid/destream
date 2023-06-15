// #region imports
    // #region external
    import {
        DestreamEvent,
    } from '../../../data';

    import {
        handleEvent,
    } from '../../viewer/event';
    // #endregion external
// #endregion imports



// #region module
const NOTIFICATION_BOX_ID = 'destream__notification-box';
const NOTIFICATION_ANCHOR_ID = 'destream__notification-anchor';


export const getNotificationBox = () => {
    const existingNotificationBox = document.getElementById(NOTIFICATION_BOX_ID);

    if (!existingNotificationBox) {
        const newNotificationBox = document.createElement('div');
        newNotificationBox.id = NOTIFICATION_BOX_ID;

        newNotificationBox.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 999999;
            width: 180px;
            height: 100px;
            overflow: auto;
            display: flex;
            flex-direction: column;
            justify-content: end;
            background-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 1) 10%,
                rgba(0, 0, 0, 0) 60%,
                rgba(0, 0, 0, 0) 100%
            );
            color: white;
            font-size: 10px;
            font-family: Ubuntu, -apple-system, BlinkMacSystemFont, sans-serif;
            user-select: none;
        `;

        const anchor = document.createElement('div');
        anchor.id = NOTIFICATION_ANCHOR_ID;
        anchor.style.cssText = `
            overflow-anchor: auto;
            height: 1px;
        `;
        newNotificationBox.appendChild(anchor);

        document.body.appendChild(newNotificationBox);

        return newNotificationBox;
    }

    return existingNotificationBox;
}


export const resolveNotificationText = (
    type: string,
) => {
    if (type.includes('Play')) return 'play';
    if (type.includes('Pause')) return 'pause';
    if (type.includes('Seek')) return 'seek';
    if (type.includes('VolumeChange')) return 'volume change';
    if (type.includes('Scroll')) return 'scroll';

    return type;
}


class NotificationManager {
    private notifications: DestreamEvent[] = [];


    private render() {
        let mounted = true;
        let secondsPassed = 0;
        const notificationIndex = this.notifications.length - 1;
        const notificationEvent = this.notifications[notificationIndex];

        const notificationBox = getNotificationBox();
        const notification = document.createElement('div');

        const anchor = document.getElementById(NOTIFICATION_ANCHOR_ID);

        const notificationTimeBox = document.createElement('div');
        notificationTimeBox.innerText = '0s ago';
        const timeInterval = setInterval(() => {
            if (!mounted) {
                clearInterval(timeInterval);
                return;
            }

            secondsPassed += 1;
            notificationTimeBox.innerText = `${secondsPassed}s ago`;
        }, 1_000);


        const notificationTextBox = document.createElement('div');
        notificationTextBox.innerText = resolveNotificationText(notificationEvent.type);
        notification.style.cssText = `
            padding: 6px 12px;
            display: flex;
            gap: 12px;
            width: calc(100% - 24px);
            align-items: center;
            justify-content: space-between;
            overflow-anchor: none;
        `;


        const notificationReplayButton = document.createElement('div');
        notificationReplayButton.innerHTML = `
            <?xml version="1.0" encoding="iso-8859-1"?>
            <svg
                fill="#000000"
                height="16px"
                width="16px"
                style="filter: invert(1);"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 300.003 300.003" xml:space="preserve"
                title="replay"
            >
                <title>replay</title>
                <path d="M150.005,0C67.164,0,0.001,67.159,0.001,150c0,82.838,67.162,150.003,150.003,150.003S300.002,232.838,300.002,150
                    C300.002,67.159,232.844,0,150.005,0z M230.091,172.444c-9.921,37.083-43.801,64.477-83.969,64.477
                    c-47.93,0-86.923-38.99-86.923-86.923s38.99-86.92,86.923-86.92c21.906,0,41.931,8.157,57.228,21.579l-13.637,23.623
                    c-11-11.487-26.468-18.664-43.594-18.664c-33.294,0-60.38,27.088-60.38,60.38c0,33.294,27.085,60.38,60.38,60.38
                    c25.363,0,47.113-15.728,56.038-37.937h-20.765l36.168-62.636l36.166,62.641H230.091z"/>
            </svg>
        `;
        notificationReplayButton.style.cssText = `
            cursor: pointer;
        `;

        const handleClick = () => {
            handleEvent(notificationEvent);
        }
        notificationReplayButton.addEventListener('click', handleClick);


        notification.appendChild(notificationTimeBox);
        notification.appendChild(notificationTextBox);
        notification.appendChild(notificationReplayButton);

        notificationBox.insertBefore(
            notification,
            anchor,
        );


        setTimeout(() => {
            mounted = false;

            notificationReplayButton.removeEventListener('click', handleClick);
            notification.remove();
            this.notifications[notificationIndex] = undefined;
            this.checkNotificationsToBeRendered();
        }, 10_000);
    }

    private checkNotificationsToBeRendered() {
        const noNotificationsToBeRendered = this.notifications.every(notification => notification === undefined);
        if (noNotificationsToBeRendered) {
            const notificationBox = getNotificationBox();
            notificationBox.remove();
            this.notifications = [];
        }
    }


    public add(
        notification: DestreamEvent,
    ) {
        this.notifications.push(notification);
        this.render();
    }
}


export const notificationManager = new NotificationManager();
// #endregion module
