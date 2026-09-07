import type { ComponentType, ReactNode } from 'react';
import type { PreviewThemeMode } from '../../../../../types';

export type WhatsappQuotedMessage = {
    author: string;
    text: string;
    accentClassName?: string;
    accentColor?: string;
    authorColor?: string;
};

export type WhatsappBubbleProps = {
    side: 'in' | 'out';
    firstInGroup?: boolean;
    time?: string;
    status?: 'sent' | 'delivered' | 'read';
    id?: string;
    quote?: WhatsappQuotedMessage;
    themeMode?: PreviewThemeMode;
    children: ReactNode;
};

type ThemeProps = {
    themeMode: PreviewThemeMode;
};

export type WhatsappComposerInputProps = ThemeProps & {
    composerAccessory?: ReactNode;
    composerLayout?: {
        messageAreaMaxWidth?: string;
    };
};

type DayChipProps = ThemeProps & {
    text: string;
};

export interface WhatsappMobileVisualAdapter {
    ConversationBackground: ComponentType<ThemeProps>;
    DayChip: ComponentType<DayChipProps>;
    EncryptedMessage: ComponentType<ThemeProps>;
    TempporalMessage: ComponentType<ThemeProps>;
    ActiveTemporalMessage: ComponentType<ThemeProps>;
    DesactiveTemporalMessage: ComponentType<ThemeProps>;
    Bubble: ComponentType<WhatsappBubbleProps>;
    MoreConversationIndicator: ComponentType<ThemeProps>;
    InputBar: ComponentType<WhatsappComposerInputProps>;
}
