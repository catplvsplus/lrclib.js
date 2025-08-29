import { resolve } from '$app/paths';
import type { Component } from 'svelte';
import { toast, type ExternalToast } from 'svelte-sonner';

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

    public send(title: string, options?: NotificationOptions & Notifications.ToastOptions) {
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

        if (options?.toast !== false) this.toast(title, options);
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

    private toast(title: string, { toast: options, toastType, body }: NotificationOptions & Notifications.ToastOptions = {}) {
        options = typeof options === 'boolean' ? {} : options ?? {};
        options.description = body;

        switch (toastType) {
            case 'success':
                toast.success(title, options);
                break;
            case 'error':
                toast.error(title, options);
                break;
            case 'warning':
                toast.warning(title, options);
                break;
            case 'info':
                toast.info(title, options);
                break;
            default:
                toast(title, options);
                break;
        }
    }
}

export namespace Notifications {
    export interface ToastOptions {
        toastType?: 'success'|'error'|'warning'|'info';
        toast?: boolean|ExternalToast<Component>;
    }
}

export const notifications = new Notifications();