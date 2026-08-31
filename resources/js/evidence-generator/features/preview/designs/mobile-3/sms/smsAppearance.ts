import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    if (themeMode === 'dark') {
        return {
            shell: '#1C2023',
            header: '#1C2023',
            conversation: '#101417',
            receivedBubble: '#1C2023',
            sentBubble: '#014C69',
            primaryText: '#E0E1E5',
            sentText: '#E8F5FA',
            secondaryText: '#BFC0C5',
            headerIcon: '#C0C7CD',
            composer: '#1C2023',
            tealPoint: '#70B9D1',
            link: '#68B8D0',
            audioBackground: '#484264',
            audioIcon: '#E4DDEF',
            redPoint: '#E9A0A5',
            statusCheck: '#C8C8CF',
            readReceiptBackground: '#101417',
            readReceiptForeground: '#E0E1E5',
            metadataIcon: '#BFC0C5',
        };
    }

    return {
        shell: '#E9EEF2',
        header: '#E9EEF2',
        conversation: '#F6FAFD',
        receivedBubble: '#E9EEF2',
        sentBubble: '#00688D',
        sentText: '#F8FCFF',
        primaryText: '#202124',
        secondaryText: '#5F6368',
        headerIcon: '#303438',
        composer: '#E9EEF2',
        tealPoint: '#008C95',
        link: '#147B86',
        audioBackground: '#E5DEFF',
        audioIcon: '#28243A',
        redPoint: '#B3261E',
        statusCheck: '#62676B',
        readReceiptBackground: '#F6FAFD',
        readReceiptForeground: '#62676B',
        metadataIcon: '#5F6368',
    };
}
