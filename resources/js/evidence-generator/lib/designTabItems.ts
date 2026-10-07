import type { ActiveDesign } from '../types';

interface DesignTabItem {
    key: ActiveDesign;
    label: string;
    accent: string;
}

export function getDesignTabItems(hasRegisteredMobileDesign: boolean): DesignTabItem[] {
    return [
        { key: 'whatsapp', label: 'WhatsApp', accent: 'bg-emerald-600' },
        ...(hasRegisteredMobileDesign ? [{ key: 'sms', label: 'SMS', accent: 'bg-indigo-600' }] : []),
    ];
}
