import type { PreviewProps } from '../../../../../types';
import { MobileCallPreview } from './MobileCallPreview';
import { MobileSmsPreview } from './MobileSmsPreview';
import { MobileWhatsappPreview } from './MobileWhatsappPreview';
import type { MobilePreviewDesignProfile, MobilePreviewRegistration } from './mobilePreviewTypes';

function createRegistration(profile: MobilePreviewDesignProfile): MobilePreviewRegistration {
    const whatsapp =
        profile.whatsapp.kind === 'custom'
            ? profile.whatsapp.Preview
            : (props: PreviewProps) => <MobileWhatsappPreview {...props} profile={profile} />;

    return {
        whatsapp,
        sms: (props: PreviewProps) => <MobileSmsPreview {...props} profile={profile} />,
        call: (props: PreviewProps) => <MobileCallPreview {...props} profile={profile} />,
    };
}

export function buildMobilePreviewRegistry<T extends Record<string, MobilePreviewDesignProfile>>(
    profiles: T,
): { [Key in keyof T]: MobilePreviewRegistration } {
    return Object.fromEntries(Object.entries(profiles).map(([key, profile]) => [key, createRegistration(profile)])) as {
        [Key in keyof T]: MobilePreviewRegistration;
    };
}
