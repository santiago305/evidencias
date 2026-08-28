import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors } from './smsTypes';

export function getSmsColors(themeMode: PreviewThemeMode): SmsColors {
    if (themeMode === 'dark') {
        return {
            shell: '#1B1F22',
            header: '#1B1F22',
            conversation: '#0D1215',
            receivedBubble: '#1C2124',
            sentBubble: '#00627D',
            primaryText: '#E6E1E6',
            secondaryText: '#BFC0C5',
            headerIcon: '#C5C7CF',
            composer: '#1C2124',
            tealPoint: '#70B9D1',
            link: '#68B8D0',
            audioBackground: '#51456D',
            audioIcon: '#E4DDEF',
            redPoint: '#E9A0A5',
            statusCheck: '#C8C8CF',
        };
    }

    return {
        shell: '#E9EEF2',
        header: '#E9EEF2',
        conversation: '#F6FAFD',
        receivedBubble: '#E9EEF2',
        sentBubble: '#00688D',
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
    };
}
