import { pushState, replaceState } from '$app/navigation';
import { page } from '$app/state';

export let bottomMenuActive = false;

export function setBottomMenuActive(active: boolean) {
    bottomMenuActive = active;
}

export function addActiveDialog(id: string, options: { type?: 'push'|'replace'; url?: string; } = {}) {
    let activeDialogs = [...(page.state.activeDialogs ?? [])];
    if (activeDialogs.includes(id)) activeDialogs = activeDialogs.filter(d => d !== id);

    activeDialogs.push(id);
    setActiveDialogs(activeDialogs, options);
}

export function removeActiveDialog(id: string, options: { type?: 'push'|'replace'; url?: string; } = {}) {
    let activeDialogs = [...(page.state.activeDialogs ?? [])];
    if (!activeDialogs.includes(id)) return;

    activeDialogs = activeDialogs.filter(d => d !== id);
    setActiveDialogs(activeDialogs, options);
}

export function setActiveDialogs(activeDialogs: string[], { type, url }: { type?: 'push'|'replace'; url?: string; } = {}) {
    url ??= '';

    switch (type ?? 'push') {
        case 'push':
            pushState(url, { ...page.state, activeDialogs });
            return;
        case 'replace':
            replaceState(url, { ...page.state, activeDialogs });
            return;
    }
}