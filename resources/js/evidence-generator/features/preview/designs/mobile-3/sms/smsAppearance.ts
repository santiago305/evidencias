import type { PreviewThemeMode } from '../../../../../types';
import type { SmsColors, SmsDesignVariant } from './smsTypes';

export function shouldShowSmsAccentPoint(randomValue = Math.random()): boolean {
    return randomValue < 0.5;
}

export function getSmsColors(themeMode: PreviewThemeMode, variant: SmsDesignVariant = 'mobile-3'): SmsColors {
    if (variant === 'mobile-1') {
        if (themeMode === 'dark') {
            return { shell: '#1C2023', header: '#1C2023', conversation: '#101817', receivedBubble: '#1C2023', sentBubble: '#004B72', sentText: '#FFFFFF', primaryText: '#E0E3E8', secondaryText: '#C2C7CD', headerIcon: '#C0C7CF', headerActionIcon: '#C0C7CF', composer: '#1C2023', tealPoint: '#70B9D1', link: '#C2C7CD', audioBackground: '#4C4161', audioIcon: '#EBDBFF', redPoint: '#E9A0A5', menuIndicator: '#E9A0A5', statusCheck: '#C2C7CD', readReceiptBackground: '#101817', readReceiptForeground: '#C2C7CD', metadataIcon: '#C2C7CD', avatarBackground: '#5CB973', avatarForeground: '#202125', systemNavigationForeground: '#C0C7CF', quickReplyBorder: '#42474D' };
        }
        return { shell: '#EAEDF2', header: '#EAEDF2', conversation: '#F5FAFE', receivedBubble: '#EAEDF2', sentBubble: '#296389', sentText: '#FFFFFF', primaryText: '#181B20', secondaryText: '#42474D', headerIcon: '#42474D', headerActionIcon: '#42474D', composer: '#EAEDF2', tealPoint: '#70B9D1', link: '#42474D', audioBackground: '#EBDBFF', audioIcon: '#211634', redPoint: '#B3261E', menuIndicator: '#B3261E', statusCheck: '#42474D', readReceiptBackground: '#F5FAFE', readReceiptForeground: '#42474D', metadataIcon: '#42474D', avatarBackground: '#5CB973', avatarForeground: '#FFFFFF', systemNavigationForeground: '#42474D', quickReplyBorder: '#C0C7CD' };
    }

    if (variant === 'mobile-2') {
        if (themeMode === 'dark') {
            return {
                shell: '#271D1E',
                header: '#271D1E',
                conversation: '#1C1010',
                receivedBubble: '#271D1E',
                sentBubble: '#FFA7A9',
                sentText: '#2F0809',
                primaryText: '#EEDEDE',
                secondaryText: '#D4C4C4',
                headerIcon: '#D7C1C3',
                headerActionIcon: '#D7C1C3',
                composer: '#271D1E',
                tealPoint: '#FF63B7',
                link: '#D4C4C4',
                audioBackground: '#5E421B',
                audioIcon: '#FEDDB4',
                redPoint: '#FF63B7',
                menuIndicator: '#FF63B7',
                statusCheck: '#D4C4C4',
                readReceiptBackground: '#1C1010',
                readReceiptForeground: '#D4C4C4',
                metadataIcon: '#D4C4C4',
                avatarBackground: '#5CB973',
                avatarForeground: '#202125',
                systemNavigationForeground: '#FFFFFF',
                quickReplyBorder: '#6E5A5B',
            };
        }

        return {
            shell: '#FAEAEB',
            header: '#FAEAEB',
            conversation: '#FFF6F7',
            receivedBubble: '#FAEAEB',
            sentBubble: '#FEDADA',
            sentText: '#24181A',
            primaryText: '#24181A',
            secondaryText: '#524444',
            headerIcon: '#524444',
            headerActionIcon: '#524444',
            composer: '#FAEAEB',
            tealPoint: '#FF63B7',
            link: '#524444',
            audioBackground: '#FEDDB4',
            audioIcon: '#281800',
            redPoint: '#FF63B7',
            menuIndicator: '#FF63B7',
            statusCheck: '#524444',
            readReceiptBackground: '#FFF6F7',
            readReceiptForeground: '#524444',
            metadataIcon: '#524444',
            avatarBackground: '#5CB973',
            avatarForeground: '#FFFFFF',
            systemNavigationForeground: '#747274',
            quickReplyBorder: '#CDBABB',
        };
    }

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
            headerActionIcon: '#D5DBDF',
            composer: '#1C2023',
            tealPoint: '#70B9D1',
            link: '#68B8D0',
            audioBackground: '#484264',
            audioIcon: '#E4DDEF',
            redPoint: '#E9A0A5',
            menuIndicator: '#F3A9B3',
            statusCheck: '#C8C8CF',
            readReceiptBackground: '#101417',
            readReceiptForeground: '#E0E1E5',
            metadataIcon: '#BFC0C5',
            avatarBackground: '#5CB973',
            avatarForeground: '#202125',
            systemNavigationForeground: '#ECEDEF',
            quickReplyBorder: '#68757B',
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
        headerActionIcon: '#303438',
        composer: '#E9EEF2',
        tealPoint: '#008C95',
        link: '#147B86',
        audioBackground: '#E5DEFF',
        audioIcon: '#28243A',
        redPoint: '#B3261E',
        menuIndicator: '#B3261E',
        statusCheck: '#62676B',
        readReceiptBackground: '#F6FAFD',
        readReceiptForeground: '#62676B',
        metadataIcon: '#5F6368',
        avatarBackground: '#49B866',
        avatarForeground: '#FFFFFF',
        systemNavigationForeground: '#6B6C6E',
        quickReplyBorder: '#B8C2C8',
    };
}
