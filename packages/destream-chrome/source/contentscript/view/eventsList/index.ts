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

const eventNotificationTimeout = 15_000;



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
            width: 200px;
            height: 100px;
            overflow: auto;
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
            scroll-behavior: smooth;
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
    const map = {
        Scroll: 'scroll',
        Cursor: 'cursor',
        Play: 'play',
        Pause: 'pause',
        Seek: 'seek',
        VolumeChange: 'volume change',
        RateChange: 'rate change',
        Like: 'like',
    };

    for (const [key, value] of Object.entries(map)) {
        if (type.includes(key)) {
            return value;
        }
    }

    return type;
}


class EventsList {
    private viewable = false;
    private events: DestreamEvent[] = [];


    private render() {
        let mounted = true;
        let secondsPassed = 0;
        const notificationIndex = this.events.length - 1;
        const notificationEvent = this.events[notificationIndex];

        const notificationBox = getNotificationBox();
        const notification = document.createElement('div');

        const anchor = document.getElementById(NOTIFICATION_ANCHOR_ID);

        const notificationTimeBox = document.createElement('div');
        notificationTimeBox.innerText = '0s ago';
        notificationTimeBox.style.cssText = `
            width: 36px;
        `;
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
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow-anchor: none;
            width: calc(100% - 24px);
            gap: 12px;
            margin-top: ${notificationIndex === 0 ? '72px' : '0'};
            padding: 6px 12px;
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


        this.scrollToBottom(notificationBox);


        setTimeout(() => {
            mounted = false;

            notificationReplayButton.removeEventListener('click', handleClick);
            notification.remove();
            this.events[notificationIndex] = undefined;
            this.checkNotificationsToBeRendered();
        }, eventNotificationTimeout);
    }

    private checkNotificationsToBeRendered() {
        const noNotificationsToBeRendered = this.events.every(notification => notification === undefined);
        if (noNotificationsToBeRendered) {
            const notificationBox = getNotificationBox();
            notificationBox.remove();
            this.events = [];
        }
    }

    private scrollToBottom(
        container: HTMLElement,
    ) {
        // Only scroll to bottom if the container is at the top and there are enough events.
        if (container.scrollTop === 0 && this.events.length > 1) {
            container.scrollBy(0, 36 * (this.events.length + 1));
        }
    }


    public add(
        event: DestreamEvent,
    ) {
        if (!this.viewable) {
            return;
        }

        this.events.push(event);
        this.render();
    }

    public setViewable(
        show: boolean,
    ) {
        this.events = [];

        if (show) {
            this.viewable = true;
        } else {
            this.viewable = false;

            const notificationBox = getNotificationBox();
            notificationBox.remove();
        }
    }
}


export const eventsList = new EventsList();
// #endregion module
