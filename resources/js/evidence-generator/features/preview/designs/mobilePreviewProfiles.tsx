import type { MobileDesignKey } from '../../../types';
import { WhatsappMobileHeaderUser as Mobile1WhatsappHeader } from './mobile-1/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile1WhatsappVisualAdapter } from './mobile-1/whatsapp/whatsappVisualAdapter';
import { PreviewMobile10Call } from './mobile-10/calls/PreviewMobile10Call';
import { PreviewMobile10Sms } from './mobile-10/sms/PreviewMobile10Sms';
import { PreviewMobile10Whatsapp } from './mobile-10/whatsapp/PreviewMobile10Whatsapp';
import { PreviewMobile11CallDesign2 } from './mobile-11/calls/design-2';
import { PreviewMobile11Sms } from './mobile-11/sms/PreviewMobile11Sms';
import { Mobile11QuickActionButton } from './mobile-11/whatsapp/whatsapp-footer';
import { WhatsappMobileHeaderUser as Mobile11WhatsappHeader } from './mobile-11/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile11WhatsappVisualAdapter } from './mobile-11/whatsapp/whatsappVisualAdapter';
import { WhatsappMobileHeaderUser as Mobile2WhatsappHeader } from './mobile-2/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile2WhatsappVisualAdapter } from './mobile-2/whatsapp/whatsappVisualAdapter';
import { WhatsappMobileHeaderUser as Mobile3WhatsappHeader } from './mobile-3/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile3WhatsappVisualAdapter } from './mobile-3/whatsapp/whatsappVisualAdapter';
import { Mobile4BatteryIcon } from './mobile-4/Mobile4BatteryIcon';
import { PreviewMobile4Whatsapp } from './mobile-4/whatsapp/PreviewMobile4Whatsapp';
import { mobile5BatteryProgress, mobile5SmsSystemChrome, mobile5WhatsappColors, mobile5WhatsappSystemChrome } from './mobile-5/mobile5Colors';
import { Mobile6QuickActionButton } from './mobile-6/whatsapp/whatsapp-footer';
import { WhatsappMobileHeaderUser as Mobile6WhatsappHeader } from './mobile-6/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile6WhatsappVisualAdapter } from './mobile-6/whatsapp/whatsappVisualAdapter';
import { PreviewMobile7Call } from './mobile-7/calls/PreviewMobile7Call';
import { PreviewMobile7Sms } from './mobile-7/sms/PreviewMobile7Sms';
import { PreviewMobile7Whatsapp } from './mobile-7/whatsapp/PreviewMobile7Whatsapp';
import { PreviewMobile8Call } from './mobile-8/calls/PreviewMobile8Call';
import { PreviewMobile8Sms } from './mobile-8/sms/PreviewMobile8Sms';
import { PreviewMobile8Whatsapp } from './mobile-8/whatsapp/PreviewMobile8Whatsapp';
import { PreviewMobile9Call } from './mobile-9/calls/PreviewMobile9Call';
import { PreviewMobile9Sms } from './mobile-9/sms/PreviewMobile9Sms';
import { PreviewMobile9Whatsapp } from './mobile-9/whatsapp/PreviewMobile9Whatsapp';
import {
    buildMobilePreviewRegistry,
    renderMobile10Frame,
    renderMobile11Frame,
    renderMobile1Frame,
    renderMobile2Frame,
    renderMobile3Frame,
    renderMobile4Frame,
    renderMobile5Footer,
    renderMobile6Frame,
    renderMobile7Frame,
    renderMobile8Frame,
    renderMobile9Frame,
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

export const mobile11WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile11WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-11'),
    visualAdapter: mobile11WhatsappVisualAdapter,
    renderComposerAccessory: (themeMode) => <Mobile11QuickActionButton themeMode={themeMode} />,
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
    renderComposerAccessory: (themeMode) => <Mobile6QuickActionButton themeMode={themeMode} />,
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
    'mobile-7': {
        key: 'mobile-7',
        frame: {
            width: '120px',
            height: '950px',
        },
        renderFrame: renderMobile7Frame,
        whatsapp: { kind: 'custom', Preview: PreviewMobile7Whatsapp },
        sms: { kind: 'custom', Preview: PreviewMobile7Sms },
        call: { kind: 'custom', Preview: PreviewMobile7Call },
    },
    'mobile-8': {
        key: 'mobile-8',
        frame: {
            width: '120px',
            height: '950px',
        },
        renderFrame: renderMobile8Frame,
        whatsapp: { kind: 'custom', Preview: PreviewMobile8Whatsapp },
        sms: { kind: 'custom', Preview: PreviewMobile8Sms },
        call: { kind: 'custom', Preview: PreviewMobile8Call },
    },
    'mobile-9': {
        key: 'mobile-9',
        frame: {
            width: '120px',
            height: '950px',
        },
        renderFrame: renderMobile9Frame,
        whatsapp: { kind: 'custom', Preview: PreviewMobile9Whatsapp },
        sms: { kind: 'custom', Preview: PreviewMobile9Sms },
        call: { kind: 'custom', Preview: PreviewMobile9Call },
    },
    'mobile-10': {
        key: 'mobile-10',
        frame: {
            width: '120px',
            height: '950px',
        },
        renderFrame: renderMobile10Frame,
        whatsapp: { kind: 'custom', Preview: PreviewMobile10Whatsapp },
        sms: { kind: 'custom', Preview: PreviewMobile10Sms },
        call: { kind: 'custom', Preview: PreviewMobile10Call },
    },
    'mobile-11': {
        key: 'mobile-11',
        renderFrame: renderMobile11Frame,
        whatsapp: mobile11WhatsappFamily,
        sms: { kind: 'custom', Preview: PreviewMobile11Sms },
        call: { kind: 'custom', Preview: PreviewMobile11CallDesign2 },
    },
} satisfies Record<MobileDesignKey, MobilePreviewDesignProfile>;

export const mobilePreviewRegistry = buildMobilePreviewRegistry(mobilePreviewProfiles);
