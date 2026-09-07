import { createContext, useContext, type ReactNode } from 'react';

export type WhatsappColorProfile = {
    headerBackground: string;
    headerText: string;
    headerIcons: string;
    conversationBackground: string;
    wallpaperPattern: string;
    outgoingBubble: string;
    outgoingText: string;
    outgoingMetadata: string;
    incomingBubble: string;
    incomingText: string;
    incomingMetadata: string;
    readChecks: string;
    dateChipBackground: string;
    dateChipText: string;
    composerBackground: string;
    composerText: string;
    composerIcons: string;
    microphoneBackground: string;
    microphoneIcon: string;
    avatarBackground?: string;
    avatarText?: string;
};

const WhatsappColorProfileContext = createContext<WhatsappColorProfile | undefined>(undefined);

export function WhatsappAppearanceProvider({ colors, children }: { colors: WhatsappColorProfile; children: ReactNode }) {
    return <WhatsappColorProfileContext.Provider value={colors}>{children}</WhatsappColorProfileContext.Provider>;
}

export function useWhatsappColorProfile(): WhatsappColorProfile | undefined {
    return useContext(WhatsappColorProfileContext);
}
