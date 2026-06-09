import { useMemo } from 'react';
import { parseLocalDateTime } from '../../../../lib/whatsapp/time';
import type { PreviewProps } from '../../../../types';
import { EmptyState } from '../../components/EmptyState';
import { buildContactIdentityDisplay } from './contactIdentityDisplay';
import { WhatsappHeaderUser } from './whatsapp-header';
import { buildWhatsappAvatarSeed } from './whatsappAppearance';
import { WhatsappConversation } from './WhatsappConversation';
import type { MsgStatus } from './WhatsappPieces';
import { WhatsappRightAside } from './WhatsappRightAside';

type WinTrayIconProps = {
    glyph: string;
    title?: string;
    className?: string | null;
    iconClassName?: string | null;
};

type TrayIconSpec = {
    key: string;
    glyph: string;
    title: string;
    className?: string | null;
    iconClassName?: string | null;
};

type TrayLanguageSpec = {
    top: string;
    bottom?: string | null;
};

type WindowsTrayProfile = {
    taskbarColor: string;
    icons: TrayIconSpec[];
    language: TrayLanguageSpec;
    languagePosition: 'next-to-hidden' | 'next-to-clock';
};

type WindowsTrayBarProps = {
    profile: WindowsTrayProfile;
    trayTime: string;
    trayDate: string;
};

const HIDDEN_ICONS_SPEC: TrayIconSpec = {
    key: 'hidden-icons',
    glyph: '\uE70E',
    title: 'Mostrar iconos ocultos',
    className: 'min-w-[26px]',
    iconClassName: 'text-[10px]',
};

const NETWORK_ICON_OPTIONS: TrayIconSpec[] = [{ key: 'wifi', glyph: '\uE701', title: 'WiFi', iconClassName: 'text-[14px]' }];

const AUDIO_ICON_OPTIONS: TrayIconSpec[] = [
    { key: 'volume', glyph: '\uE995', title: 'Volumen', className: 'min-w-5.5', iconClassName: 'text-[13px]' },
    { key: 'muted', glyph: '\uE74F', title: 'Silenciado', iconClassName: 'text-[14px]' },
];

const OPTIONAL_TRAY_ICON_POOL: TrayIconSpec[] = [
    { key: 'vpn', glyph: '\uE705', title: 'VPN', iconClassName: 'text-[14px]' },
    { key: 'bluetooth', glyph: '\uE702', title: 'Bluetooth', iconClassName: 'text-[14px]' },
    { key: 'usb', glyph: '\uE88E', title: 'USB', iconClassName: 'text-[14px]' },
    { key: 'printer', glyph: '\uE749', title: 'Impresora', iconClassName: 'text-[14px]' },
    { key: 'microphone', glyph: '\uE720', title: 'Micrófono', iconClassName: 'text-[14px]' },
    { key: 'cloud', glyph: '\uE753', title: 'Cloud / OneDrive', iconClassName: 'text-[14px]' },
    { key: 'defender', glyph: '\uE83D', title: 'Windows Defender', iconClassName: 'text-[14px]' },
    { key: 'notifications', glyph: '\uEB50', title: 'Notificaciones', iconClassName: 'text-[14px]' },
];

const LANGUAGE_OPTIONS: TrayLanguageSpec[] = [{ top: 'ESP', bottom: 'LAA' }, { top: 'ESP' }];

function WinTrayIcon({ glyph, title, className = '', iconClassName = '' }: WinTrayIconProps) {
    return (
        <span title={title} className={`flex h-10 min-w-[20px] items-center justify-center select-none ${className}`}>
            <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center leading-none text-white ${iconClassName}`}
                style={{
                    fontFamily: "'Segoe Fluent Icons', 'Segoe MDL2 Assets'",
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                }}
            >
                {glyph}
            </span>
        </span>
    );
}

function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function createSeededRandom(seed: number): () => number {
    let state = seed || 1;

    return () => {
        state += 0x6d2b79f5;
        let temp = state;
        temp = Math.imul(temp ^ (temp >>> 15), temp | 1);
        temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);
        return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
    };
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    if (s === 0) {
        const gray = Math.round(l * 255)
            .toString(16)
            .padStart(2, '0');
        return `#${gray}${gray}${gray}`;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const toChannel = (t: number): string => {
        let value = t;

        if (value < 0) {
            value += 1;
        }
        if (value > 1) {
            value -= 1;
        }

        let channel = p;

        if (value < 1 / 6) {
            channel = p + (q - p) * 6 * value;
        } else if (value < 1 / 2) {
            channel = q;
        } else if (value < 2 / 3) {
            channel = p + (q - p) * (2 / 3 - value) * 6;
        }

        return Math.round(channel * 255)
            .toString(16)
            .padStart(2, '0');
    };

    const red = toChannel(h + 1 / 3);
    const green = toChannel(h);
    const blue = toChannel(h - 1 / 3);

    return `#${red}${green}${blue}`;
}

function normalizeHue(hue: number): number {
    const normalized = hue % 360;
    return normalized < 0 ? normalized + 360 : normalized;
}

function deterministicShuffle<T>(values: T[], random: () => number): T[] {
    const result = [...values];

    for (let index = result.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(random() * (index + 1));
        const currentValue = result[index];
        result[index] = result[randomIndex];
        result[randomIndex] = currentValue;
    }

    return result;
}

function pickOne<T>(values: T[], random: () => number): T {
    return values[Math.floor(random() * values.length)];
}

function createWindowsTrayProfile(seedInput: string): WindowsTrayProfile {
    const seed = hashString(seedInput || 'tray-default');
    const random = createSeededRandom(seed);

    const baseHue = normalizeHue(Math.round(random() * 359));
    const saturation = 32 + Math.floor(random() * 26);
    const lightness = 16 + Math.floor(random() * 13);
    const taskbarColor = hslToHex(baseHue, saturation, lightness);

    const networkIcon = pickOne(NETWORK_ICON_OPTIONS, random);
    const audioIcon = pickOne(AUDIO_ICON_OPTIONS, random);

    const optionalIconCount = Math.floor(random() * 5);
    const optionalPool = deterministicShuffle(OPTIONAL_TRAY_ICON_POOL, random);
    const optionalIcons = optionalPool.slice(0, optionalIconCount);

    const icons = deterministicShuffle([networkIcon, audioIcon, ...optionalIcons], random);
    const language = pickOne(LANGUAGE_OPTIONS, random);
    const languagePosition = random() < 0.5 ? 'next-to-hidden' : 'next-to-clock';

    return {
        taskbarColor,
        icons,
        language,
        languagePosition,
    };
}

function renderTrayLanguage(language: TrayLanguageSpec) {
    return (
        <div className="flex h-10 min-w-[39px] flex-col items-center justify-center text-[11px] leading-[14px] tracking-tight text-white">
            <span>{language.top}</span>
            {language.bottom ? <span>{language.bottom}</span> : null}
        </div>
    );
}

function formatWindowsTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

function formatWindowsDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
}

function WindowsTrayBar({ profile, trayTime, trayDate }: WindowsTrayBarProps) {
    return (
        <div
            className="flex h-10 w-full shrink-0 items-center justify-end border-t border-white/10 pr-5 pl-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                backgroundColor: profile.taskbarColor,
            }}
        >
            <div className="flex h-10 items-center gap-0 overflow-hidden">
                <WinTrayIcon
                    glyph={HIDDEN_ICONS_SPEC.glyph}
                    title={HIDDEN_ICONS_SPEC.title}
                    className={HIDDEN_ICONS_SPEC.className ?? ''}
                    iconClassName={HIDDEN_ICONS_SPEC.iconClassName ?? ''}
                />

                {profile.languagePosition === 'next-to-hidden' ? renderTrayLanguage(profile.language) : null}

                {profile.icons.map((icon) => (
                    <WinTrayIcon
                        key={icon.key}
                        glyph={icon.glyph}
                        title={icon.title}
                        className={icon.className ?? ''}
                        iconClassName={icon.iconClassName ?? ''}
                    />
                ))}

                {profile.languagePosition === 'next-to-clock' ? renderTrayLanguage(profile.language) : null}

                {/* Hora y fecha */}
                <div className="ml-[7px] flex h-10 min-w-[50px] flex-col items-end justify-center text-[11px] leading-[14px] tracking-tight text-white">
                    <span id="hora-final-conversacion">{trayTime}</span>
                    <span>{trayDate}</span>
                </div>
            </div>
        </div>
    );
}

type PreviewBlockWhatsappProps = PreviewProps;

export function PreviewBlockWhatsapp({ data, themeMode }: PreviewBlockWhatsappProps) {
    const userSeed = useMemo(() => buildWhatsappAvatarSeed(data ?? undefined), [data]);

    const messageStatus = useMemo<MsgStatus>(() => {
        if (data?.previewSnapshot) {
            return data.previewSnapshot.messageStatus;
        }

        const random = createSeededRandom(hashString(`${userSeed}|status`));
        return random() < 0.5 ? 'read' : 'delivered';
    }, [data?.previewSnapshot, userSeed]);

    const temporalBehavior = useMemo(() => {
        if (data?.previewSnapshot) {
            return data.previewSnapshot.temporalBehavior;
        }

        const random = createSeededRandom(hashString(`${userSeed}|temporal`));
        const showsTimerIcon = random() < 0.5;

        if (!showsTimerIcon) {
            const showsTemporalMessagesWhileDisabled = random() < 0.5;

            if (!showsTemporalMessagesWhileDisabled) {
                return {
                    showTemporaryIcon: false,
                    showDefaultTemporalMessage: false,
                    temporalStatusLabel: 'Desactivado' as const,
                    inlineTemporalMode: null,
                };
            }

            return {
                showTemporaryIcon: false,
                showDefaultTemporalMessage: true,
                temporalStatusLabel: 'Desactivado' as const,
                inlineTemporalMode: 'deactive' as const,
            };
        }

        const usesInlineActivationVariant = random() < 0.5;

        if (usesInlineActivationVariant) {
            return {
                showTemporaryIcon: true,
                showDefaultTemporalMessage: false,
                temporalStatusLabel: '90 días' as const,
                inlineTemporalMode: 'active' as const,
            };
        }

        return {
            showTemporaryIcon: true,
            showDefaultTemporalMessage: true,
            temporalStatusLabel: '90 días' as const,
            inlineTemporalMode: null,
        };
    }, [data?.previewSnapshot, userSeed]);

    const contactIdentityDisplay = useMemo(
        () =>
            data
                ? buildContactIdentityDisplay(data)
                : {
                      headerTitle: 'Aracely MD',
                      profileTitle: 'Sin nombre',
                      profileSubtitle: '+51 —',
                      showAddContactAction: false,
                  },
        [data],
    );

    const windowsTrayData = useMemo(() => {
        if (data?.previewSnapshot) {
            return {
                profile: data.previewSnapshot.trayProfile,
                trayTime: data.previewSnapshot.trayTime,
                trayDate: data.previewSnapshot.trayDate,
            };
        }

        const trayMoment = parseLocalDateTime(data?.fechaHoraRegistro ?? '') ?? parseLocalDateTime(data?.fechaHora ?? '') ?? new Date();

        return {
            profile: data?.trayProfile ?? createWindowsTrayProfile(userSeed),
            trayTime: formatWindowsTime(trayMoment),
            trayDate: formatWindowsDate(trayMoment),
        };
    }, [data?.fechaHora, data?.fechaHoraRegistro, data?.previewSnapshot, data?.trayProfile, userSeed]);

    if (!data) return <EmptyState />;

    return (
        <div className={['flex h-full w-full flex-col', themeMode === 'dark' ? 'bg-[#0b141a]' : 'bg-[#efeae2]'].join(' ')} id="CAPTURA">
            <div className="flex min-h-0 w-full flex-1">
                <div className="flex min-w-0 flex-[3.3] flex-col">
                    <WhatsappHeaderUser
                        data={data}
                        status={messageStatus}
                        showTemporaryIndicator={temporalBehavior.showTemporaryIcon}
                        displayTitle={contactIdentityDisplay.headerTitle}
                        themeMode={themeMode}
                    />

                    <WhatsappConversation
                        data={data}
                        messageStatus={messageStatus}
                        messages={data.generatedMessages}
                        showDefaultTemporalMessage={temporalBehavior.showDefaultTemporalMessage}
                        inlineTemporalMode={temporalBehavior.inlineTemporalMode}
                        inlineTemporalInsertIndex={data.previewSnapshot?.inlineTemporalInsertIndex ?? null}
                        displayTitle={contactIdentityDisplay.headerTitle}
                        deviceMode="desktop"
                        themeMode={themeMode}
                    />
                </div>

                <WhatsappRightAside
                    data={data}
                    temporalStatusLabel={temporalBehavior.temporalStatusLabel}
                    profileTitle={contactIdentityDisplay.profileTitle}
                    profileSubtitle={contactIdentityDisplay.profileSubtitle}
                    showAddContactAction={contactIdentityDisplay.showAddContactAction}
                    themeMode={themeMode}
                />
            </div>

            <WindowsTrayBar profile={windowsTrayData.profile} trayTime={windowsTrayData.trayTime} trayDate={windowsTrayData.trayDate} />
        </div>
    );
}
