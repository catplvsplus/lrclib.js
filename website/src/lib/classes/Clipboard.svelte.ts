export class Clipboard {
    public copied: boolean = $state(false);
    public text: string = $state('');

    public copiedDelay: number;

    private resetTimer: ReturnType<typeof setTimeout>|null = null;

    public constructor(options?: { copiedDelay?: number }) {
        this.copiedDelay = options?.copiedDelay ?? 2000;

        $effect(() => () => {
            if (this.resetTimer) {
                clearTimeout(this.resetTimer);
            }
        });
    }

    public async copy(value: string) {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(value);
        } else {
            // execCommand fallback
            const textarea = document.createElement('textarea');
            textarea.value = value;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        this.text = value;
        this.copied = true;

        if (this.resetTimer) {
            clearTimeout(this.resetTimer);
        }

        this.resetTimer = setTimeout(
            () => this.copied = false,
            this.copiedDelay
        );
    }
}