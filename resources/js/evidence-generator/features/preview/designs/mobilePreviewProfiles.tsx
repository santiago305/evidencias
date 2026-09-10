import type { MobileDesignKey } from '../../../types';
import { WhatsappMobileHeaderUser as Mobile1WhatsappHeader } from './mobile-1/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile1WhatsappVisualAdapter } from './mobile-1/whatsapp/whatsappVisualAdapter';
import { WhatsappMobileHeaderUser as Mobile2WhatsappHeader } from './mobile-2/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile2WhatsappVisualAdapter } from './mobile-2/whatsapp/whatsappVisualAdapter';
import { WhatsappMobileHeaderUser as Mobile3WhatsappHeader } from './mobile-3/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile3WhatsappVisualAdapter } from './mobile-3/whatsapp/whatsappVisualAdapter';
import { Mobile4BatteryIcon } from './mobile-4/Mobile4BatteryIcon';
import { PreviewMobile4Whatsapp } from './mobile-4/whatsapp/PreviewMobile4Whatsapp';
import { mobile5BatteryProgress, mobile5SmsSystemChrome, mobile5WhatsappColors, mobile5WhatsappSystemChrome } from './mobile-5/mobile5Colors';
import { WhatsappMobileHeaderUser as Mobile6WhatsappHeader } from './mobile-6/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { Mobile6QuickActionButton } from './mobile-6/whatsapp/whatsapp-footer';
import { mobile6WhatsappVisualAdapter } from './mobile-6/whatsapp/whatsappVisualAdapter';
import {
    buildMobilePreviewRegistry,
    renderMobile1Frame,
    renderMobile2Frame,
    renderMobile3Frame,
    renderMobile4Frame,
    renderMobile5Footer,
    renderMobile6Frame,
    type ComposedMobileWhatsappProfile,
    type MobileBatteryRenderer,
    type MobilePreviewDesignProfile,
} from './shared/mobile-preview';
import { getWhatsappBehaviorProfile } from './shared/whatsapp/whatsappProfiles';

export const mobile1WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile1WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-1'),
    visualAdapter: mobile1WhatsappVisualAdapter,
};

export const mobile2WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile2WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-2'),
    visualAdapter: mobile2WhatsappVisualAdapter,
};

export const mobile3WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile3WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-3'),
    visualAdapter: mobile3WhatsappVisualAdapter,
};

export const mobile5WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile3WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-5'),
    visualAdapter: mobile3WhatsappVisualAdapter,
    colors: mobile5WhatsappColors,
    systemChrome: mobile5WhatsappSystemChrome,
    composerLayout: {
        messageAreaMaxWidth: '110px',
    },
    renderComposerAccessory: (themeMode) => {
        const colors = mobile5WhatsappColors[themeMode];

        return (
            <button type="button" aria-label="Acción rápida" className="grid h-[35px] w-[35px] place-items-center rounded-full">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
                    <path
                        d="M14 2.5 L6.25 12.65 L10.25 12.65 L9.45 21.5 L17.75 10.85 L13.65 10.85 Z"
                        fill={colors.composerBackground}
                        stroke={colors.composerIcons}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        );
    },
};

export const mobile6WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile6WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-6'),
    visualAdapter: mobile6WhatsappVisualAdapter,
    composerLayout: {
        messageAreaMaxWidth: '175px',
    },
    renderComposerAccessory: (themeMode) => (
        <Mobile6QuickActionButton themeMode={themeMode} />
    ),
};

export const mobile5BatteryRenderer: MobileBatteryRenderer = (level, themeMode) => (
    <Mobile4BatteryIcon level={level} themeMode={themeMode} progressColor={mobile5BatteryProgress[themeMode]} />
);

export const mobile3SmsFamily = {
    variant: 'mobile-3' as const,
    showVideoCall: true,
};

export const mobilePreviewProfiles = {
    'mobile-1': {
        key: 'mobile-1',
        renderFrame: renderMobile1Frame,
        whatsapp: mobile1WhatsappFamily,
        sms: { variant: 'mobile-1', showVideoCall: true },
        call: { missedSpacingVariant: 'mobile-1' },
    },
    'mobile-2': {
        key: 'mobile-2',
        renderFrame: renderMobile2Frame,
        whatsapp: mobile2WhatsappFamily,
        sms: { variant: 'mobile-2', showVideoCall: false },
        call: { missedSpacingVariant: 'standard' },
    },
    'mobile-3': {
        key: 'mobile-3',
        renderFrame: renderMobile3Frame,
        whatsapp: mobile3WhatsappFamily,
        sms: mobile3SmsFamily,
        call: { missedSpacingVariant: 'standard' },
    },
    'mobile-4': {
        key: 'mobile-4',
        renderFrame: renderMobile4Frame,
        whatsapp: { kind: 'custom', Preview: PreviewMobile4Whatsapp },
        sms: { variant: 'mobile-2', showVideoCall: false },
        call: { missedSpacingVariant: 'standard' },
    },
    'mobile-5': {
        key: 'mobile-5',
        renderFrame: renderMobile3Frame,
        frame: {
            width: '373px',
            height: '950px',
        },
        batteryRenderer: mobile5BatteryRenderer,
        footerRenderer: renderMobile5Footer,
        whatsapp: mobile5WhatsappFamily,
        sms: {
            ...mobile3SmsFamily,
            systemChrome: mobile5SmsSystemChrome,
            composerLayout: {
                messageAreaMaxWidth: '150px',
            },
        },
        call: { missedSpacingVariant: 'standard' },
    },
    'mobile-6': {
        key: 'mobile-6',
        frame: {
            width: '420px',
            height: '950px',
        },
        renderFrame: renderMobile6Frame,
        whatsapp: mobile6WhatsappFamily,
        sms: { variant: 'mobile-6', showVideoCall: true },
        call: { missedSpacingVariant: 'standard' },
    },
} satisfies Record<MobileDesignKey, MobilePreviewDesignProfile>;

export const mobilePreviewRegistry = buildMobilePreviewRegistry(mobilePreviewProfiles);
