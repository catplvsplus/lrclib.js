import { page } from '$app/state';
import { addActiveDialog, removeActiveDialog } from '../pageState';

export class DialogState {
    public id?: string;
    public mode: 'push'|'replace' = 'push';
    public dialogUrl?: string;

    public isOpen: boolean = $state(false);
    public isActive: boolean = $derived(this.id ? page.state.activeDialogs?.at(-1) === this.id : false);

    constructor(options?: DialogState.Options) {
        if (options?.open) this.open();
        if (options?.id) this.id = options.id;
        if (options?.mode) this.mode = options.mode;
        if (options?.dialogUrl) this.dialogUrl = options.dialogUrl;

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    public open() {
        this.isOpen = true;

        if (this.id && !this.isActive) {
            addActiveDialog(this.id, { type: this.mode, url: this.dialogUrl });
        }
    }

    public close() {
        this.isOpen = false;

        if (this.id && this.isActive) {
            removeActiveDialog(this.id, { type: this.mode, url: this.dialogUrl });
        }
    }

    public toggle(value?: boolean) {
        value ??= !this.isOpen;

        if (value) {
            this.open();
        } else {
            this.close();
        }
    }
}

export namespace DialogState {
    export interface Options {
        open?: boolean;
        id?: string;
        mode?: 'push'|'replace';
        dialogUrl?: string;
    }
}