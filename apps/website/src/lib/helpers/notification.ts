import { resolve } from '$app/paths';
import { toast } from 'svelte-sonner';

export async function askNotificationPermission(): Promise<NotificationPermission> {
    return 'Notification' in window ? await Notification.requestPermission() : 'denied';
}

export function getNotificationPermission(): NotificationPermission {
    return 'Notification' in window ? Notification.permission : 'denied';
}

export async function sendNotification(title: string, options: NotificationOptions & { toast?: boolean; }) {
    if ((await askNotificationPermission()) === 'granted') {
        new Notification(title, {
            icon: `${resolve('/')}icon-192.png`,
            tag: 'lrclib.js',
            ...options
        });
    }

    if (options.toast !== false) toast(title);
}