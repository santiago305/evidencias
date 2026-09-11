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
    const sms = profile.sms.kind === 'custom'
        ? profile.sms.Preview
        : (props: PreviewProps) => <MobileSmsPreview {...props} profile={profile} />;
    const call = profile.call.kind === 'custom'
        ? profile.call.Preview
        : (props: PreviewProps) => <MobileCallPreview {...props} profile={profile} />;

    return {
        whatsapp,
        sms,
        call,
    };
}

export function buildMobilePreviewRegistry<T extends Record<string, MobilePreviewDesignProfile>>(
    profiles: T,
): { [Key in keyof T]: MobilePreviewRegistration } {
    return Object.fromEntries(Object.entries(profiles).map(([key, profile]) => [key, createRegistration(profile)])) as {
        [Key in keyof T]: MobilePreviewRegistration;
    };
}
