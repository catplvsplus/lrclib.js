import { resolve } from '$app/paths';
import { toast } from 'svelte-sonner';

export class Notifications {
    public current: Notification[] = $state([]);

    get permission(): NotificationPermission {
        return 'Notification' in window ? Notification.permission : 'denied';
    }

    constructor() {
        this.askPermission = this.askPermission.bind(this);
        this.send = this.send.bind(this);
        this.clear = this.clear.bind(this);
    }

    public async askPermission(): Promise<NotificationPermission> {
        return 'Notification' in window ? await Notification.requestPermission() : 'denied';
    }

    public async send(title: string, options?: NotificationOptions & { toast?: boolean; }) {
        if ((await this.askPermission()) === 'granted') {
            const notification = new Notification(title, {
                icon: `${resolve('/')}icon-192.png`,
                ...options
            });

            this.current.push(notification);

            notification.onclose = () => {
                this.current = this.current.filter(n => n !== notification);
            }
        }

        if (options?.toast !== false) toast(title);
    }

    public clear() {
        for (const notification of this.current) {
            notification.close();
        }
    }
}

export const notifications = new Notifications();