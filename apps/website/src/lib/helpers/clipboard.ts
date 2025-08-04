
export function selectText(node: HTMLElement): boolean {
    if ('createTextRange' in document.body) {
        // @ts-expect-error
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
        return true;
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return true;
    } else {
        return false;
    }
}

export function copyText(options: { text?: string; container?: HTMLElement; selectRequired?: boolean; }) {
    const text = options.text ?? options.container?.textContent ?? '';
    const selected = options.container ? selectText(options.container) : false;
    if (options.selectRequired && !selected) return false;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        document.execCommand('copy');
    }

    return true;
}