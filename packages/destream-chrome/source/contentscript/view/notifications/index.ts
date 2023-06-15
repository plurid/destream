// #region module
const NOTIFICATION_BOX_ID = 'destream__notification-box';

export const getNotificationBox = () => {
    const existingNotificationBox = document.getElementById(NOTIFICATION_BOX_ID);

    if (!existingNotificationBox) {
        const newNotificationBox = document.createElement('div');
        newNotificationBox.id = NOTIFICATION_BOX_ID;

        newNotificationBox.style.position = 'fixed';
        newNotificationBox.style.bottom = '10px';
        newNotificationBox.style.left = '10px';
        newNotificationBox.style.zIndex = '999999';
        newNotificationBox.style.width = '180px';
        newNotificationBox.style.height = '100px';
        newNotificationBox.style.overflow = 'auto';
        newNotificationBox.style.display = 'flex';
        newNotificationBox.style.flexFlow = 'column-reverse nowrap';
        newNotificationBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        newNotificationBox.style.color = 'white';
        newNotificationBox.style.fontSize = '10px';
        newNotificationBox.style.fontFamily = `Ubuntu, -apple-system, BlinkMacSystemFont, sans-serif`;

        document.body.appendChild(newNotificationBox);

        return newNotificationBox;
    }

    return existingNotificationBox;
}


class NotificationManager {
    private notifications: string[] = [];


    private render() {
        const notificationBox = getNotificationBox();

        const notification = document.createElement('div');

        const notificationTimeBox = document.createElement('div');
        let mounted = true;
        let secondsPassed = 0;
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

        const notificationIndex = this.notifications.length - 1;
        notificationTextBox.innerText = `${this.notifications[notificationIndex]}`;

        notification.appendChild(notificationTimeBox);
        notification.appendChild(notificationTextBox);

        notification.style.padding = '6px 12px';
        notification.style.display = 'flex';
        notification.style.gap = '12px';

        // Add a replay button

        notificationBox.appendChild(notification);

        setTimeout(() => {
            mounted = false;
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
        notification: string,
    ) {
        this.notifications.push(notification);
        this.render();
    }
}


export const notificationManager = new NotificationManager();
// #endregion module
