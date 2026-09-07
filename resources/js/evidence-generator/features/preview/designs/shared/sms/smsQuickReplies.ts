import type { GeneratedMessage } from '../../../../../types';

export interface SmsQuickReply {
    id: string;
    label: string;
}

const fallbackReplies = ['Que', 'Hola', 'Mande', '😁'];

function reply(label: string): SmsQuickReply {
    return { id: label.toLocaleLowerCase('es-PE'), label };
}

export function getSmsQuickReplies(messages: GeneratedMessage[] | undefined): SmsQuickReply[] {
    const recentMessages = (messages ?? []).slice(-8);
    const incoming = [...recentMessages].reverse().find((message) => message.side === 'in');
    const text = incoming?.lines.join(' ').trim() ?? '';
    const normalized = text.toLocaleLowerCase('es-PE');
    let labels: string[];

    if (!text) {
        labels = fallbackReplies;
    } else if (/[?¿]|\b(cuándo|cuando|cómo|como|qué|que|dónde|donde|puedes|podemos)\b/.test(normalized)) {
        labels = ['Sí', 'No', 'Qué', 'Mande'];
    } else if (/\b(hola|buenas|hey|holi)\b/.test(normalized)) {
        labels = ['Hola', 'Qué tal', 'Dime', '😊'];
    } else if (text.split(/\s+/).length <= 4) {
        labels = ['Que', 'Hola', 'Mande', '😁'];
    } else {
        labels = ['Entiendo', 'Claro', 'Gracias', '😊'];
    }

    return labels.map(reply);
}
