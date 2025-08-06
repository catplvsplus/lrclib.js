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

    public send(title: string, options?: NotificationOptions & { toast?: boolean; }) {
        if (this.permission === 'granted' && !this.isWindowVisible()) {
            const notification = new Notification(title, {
                icon: `${resolve('/')}icon-192.png`,
                ...options
            });

            this.current.push(notification);

            notification.onclose = () => {
                this.current = this.current.filter(n => n !== notification);
            }

            notification.onclick = () => {
                window.focus();
                notification.close();
            }
        }

        if (options?.toast !== false) toast(title);
    }

    public clear() {
        for (const notification of this.current) {
            notification.close();
        }
    }

    public isWindowVisible(checkFocus: boolean = true): boolean {
        const visible = typeof document !== 'undefined' && document.visibilityState === 'visible';
        const focused = typeof document !== 'undefined' && document.hasFocus();

        return visible && (checkFocus ? focused : true);
    }
}

export const notifications = new Notifications();