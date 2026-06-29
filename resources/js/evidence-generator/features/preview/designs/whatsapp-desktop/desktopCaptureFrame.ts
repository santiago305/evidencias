import type { CSSProperties } from 'react';

export type WhatsappDesktopCaptureMode =
    | 'near-full'
    | 'chat-main'
    | 'wide-chat'
    | 'aside-mostly-visible'
    | 'aside-wide-visible'
    | 'chat-with-aside-slice'
    | 'chat-with-deep-aside-slice'
    | 'chat-with-tray-slice'
    | 'tray-heavy'
    | 'left-offset'
    | 'tight-conversation'
    | 'slightly-cropped';

export interface WhatsappDesktopCaptureFrame {
    version: 'desktop-capture-v1';
    mode: WhatsappDesktopCaptureMode;
    cropTopPx: number;
    cropRightPx: number;
    cropBottomPx: number;
    cropLeftPx: number;
    asideSlicePx: number;
    traySlicePx: number;
}

interface BuildRandomDesktopCaptureFrameParams {
    rootRect: DOMRectReadOnly;
    headerRect: DOMRectReadOnly;
    messageViewportRect: DOMRectReadOnly;
    rightAsideRect?: DOMRectReadOnly | null;
    requiredRightAsideIdentityRect?: DOMRectReadOnly | null;
    trayRect?: DOMRectReadOnly | null;
}

interface BuildDesktopCaptureFrameStyleParams {
    frame: WhatsappDesktopCaptureFrame;
}

interface RelativeRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
}

type WhatsappDesktopCaptureFrameInput = Omit<WhatsappDesktopCaptureFrame, 'version'>;

const MAX_RANDOM_ATTEMPTS = 500;
const MIN_CAPTURE_WIDTH_PX = 360;
const MIN_CAPTURE_HEIGHT_PX = 260;
const MIN_HEADER_VISIBLE_HEIGHT_PX = 38;
const MIN_MESSAGE_VISIBLE_HEIGHT_PX = 175;
const MIN_MESSAGE_VISIBLE_WIDTH_PX = 300;
const MIN_REQUIRED_RIGHT_ASIDE_IDENTITY_VISIBLE_HEIGHT_PX = 52;
const MIN_REQUIRED_RIGHT_ASIDE_IDENTITY_VISIBLE_WIDTH_PX = 150;

export function buildRandomDesktopCaptureFrame({
    rootRect,
    headerRect,
    messageViewportRect,
    rightAsideRect = null,
    requiredRightAsideIdentityRect = null,
    trayRect = null,
}: BuildRandomDesktopCaptureFrameParams): WhatsappDesktopCaptureFrame {
    const rootWidth = Math.max(0, Math.round(rootRect.width));
    const rootHeight = Math.max(0, Math.round(rootRect.height));
    const header = toRelativeRect(rootRect, headerRect);
    const messageViewport = toRelativeRect(rootRect, messageViewportRect);
    const rightAside = rightAsideRect ? toRelativeRect(rootRect, rightAsideRect) : null;
    const requiredRightAsideIdentity = requiredRightAsideIdentityRect ? toRelativeRect(rootRect, requiredRightAsideIdentityRect) : null;
    const tray = trayRect ? toRelativeRect(rootRect, trayRect) : null;
    const hasRightAside = Boolean(rightAside && rightAside.width >= 80);
    const hasTray = Boolean(tray && tray.height >= 12);

    for (let attempt = 0; attempt < MAX_RANDOM_ATTEMPTS; attempt += 1) {
        const frame = buildCandidateFrame({
            rootWidth,
            rootHeight,
            header,
            messageViewport,
            rightAside,
            tray,
            hasRightAside,
            hasTray,
        });

        if (isValidCaptureFrame(frame, rootWidth, rootHeight, header, messageViewport, requiredRightAsideIdentity)) {
            return frame;
        }
    }

    return buildFallbackCaptureFrame({ rootWidth, rootHeight, header, messageViewport, rightAside, requiredRightAsideIdentity, tray });
}

export function buildDesktopCaptureFrameStyle({ frame }: BuildDesktopCaptureFrameStyleParams): CSSProperties {
    return {
        top: `${frame.cropTopPx}px`,
        right: `${frame.cropRightPx}px`,
        bottom: `${frame.cropBottomPx}px`,
        left: `${frame.cropLeftPx}px`,
    };
}

function buildCandidateFrame(params: {
    rootWidth: number;
    rootHeight: number;
    header: RelativeRect;
    messageViewport: RelativeRect;
    rightAside: RelativeRect | null;
    tray: RelativeRect | null;
    hasRightAside: boolean;
    hasTray: boolean;
}): WhatsappDesktopCaptureFrame {
    const mode = pickCaptureMode(params.hasRightAside, params.hasTray);
    const maxTopCrop = getMaxSafeTopCrop(params.header);
    const maxBottomCrop = getMaxSafeBottomCrop(params.rootHeight, params.messageViewport);
    const maxLeftCrop = Math.min(56, Math.max(0, params.messageViewport.right - MIN_MESSAGE_VISIBLE_WIDTH_PX));
    const maxRightCrop = Math.max(
        0,
        Math.min(
            params.rootWidth - MIN_MESSAGE_VISIBLE_WIDTH_PX,
            Math.max(0, params.rootWidth - params.messageViewport.left - MIN_MESSAGE_VISIBLE_WIDTH_PX),
        ),
    );
    const rightAsideWidth = params.rightAside?.width ?? 0;
    const rightAsideStart = params.rightAside?.left ?? params.rootWidth;
    const trayHeight = params.tray?.height ?? 0;
    const trayTop = params.tray?.top ?? params.rootHeight;

    switch (mode) {
        case 'chat-main': {
            const cropRightPx = params.hasRightAside
                ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-36, 150)), 0, maxRightCrop)
                : randomInt(0, Math.min(54, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(16, maxTopCrop)),
                cropRightPx,
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(-6, 52)), 0, maxBottomCrop)
                    : randomInt(8, Math.min(68, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(30, maxLeftCrop)),
                asideSlicePx: 0,
                traySlicePx: 0,
            });
        }
        case 'wide-chat': {
            const cropRightPx = params.hasRightAside
                ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-80, 70)), 0, maxRightCrop)
                : randomInt(0, Math.min(26, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(8, maxTopCrop)),
                cropRightPx,
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(-10, 18)), 0, maxBottomCrop)
                    : randomInt(0, Math.min(32, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(12, maxLeftCrop)),
                asideSlicePx: params.hasRightAside ? clamp(Math.round(rightAsideWidth - cropRightPx), 0, Math.round(rightAsideWidth)) : 0,
                traySlicePx: params.hasTray ? Math.round(trayHeight) : 0,
            });
        }
        case 'aside-mostly-visible': {
            const asideVisiblePx = params.hasRightAside
                ? randomInt(Math.max(120, Math.round(rightAsideWidth * 0.42)), Math.max(150, Math.round(rightAsideWidth * 0.92)))
                : 0;
            const cropRightPx = params.hasRightAside
                ? clamp(Math.round(params.rootWidth - rightAsideStart - asideVisiblePx + randomInt(-18, 22)), 0, maxRightCrop)
                : randomInt(0, Math.min(18, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(18, maxTopCrop)),
                cropRightPx,
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(-12, 36)), 0, maxBottomCrop)
                    : randomInt(0, Math.min(54, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(38, maxLeftCrop)),
                asideSlicePx: asideVisiblePx,
                traySlicePx: params.hasTray ? Math.round(trayHeight) : 0,
            });
        }
        case 'aside-wide-visible': {
            const cropRightPx = params.hasRightAside ? randomInt(0, Math.min(46, maxRightCrop)) : randomInt(0, Math.min(22, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(12, maxTopCrop)),
                cropRightPx,
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(-10, 28)), 0, maxBottomCrop)
                    : randomInt(0, Math.min(42, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(24, maxLeftCrop)),
                asideSlicePx: params.hasRightAside ? Math.round(rightAsideWidth) : 0,
                traySlicePx: params.hasTray ? Math.round(trayHeight) : 0,
            });
        }
        case 'chat-with-aside-slice': {
            const asideSlicePx = params.hasRightAside
                ? randomInt(12, Math.max(36, Math.min(210, Math.round(rightAsideWidth * 0.72))))
                : 0;
            const cropRightPx = params.hasRightAside
                ? clamp(Math.round(params.rootWidth - rightAsideStart - asideSlicePx + randomInt(-22, 24)), 0, maxRightCrop)
                : randomInt(0, Math.min(34, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(16, maxTopCrop)),
                cropRightPx,
                cropBottomPx: randomInt(6, Math.min(66, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(26, maxLeftCrop)),
                asideSlicePx,
                traySlicePx: 0,
            });
        }
        case 'chat-with-deep-aside-slice': {
            const asideSlicePx = params.hasRightAside
                ? randomInt(
                      Math.max(44, Math.round(rightAsideWidth * 0.2)),
                      Math.max(56, Math.min(Math.round(rightAsideWidth * 0.88), 300)),
                  )
                : 0;
            const cropRightPx = params.hasRightAside
                ? clamp(Math.round(params.rootWidth - rightAsideStart - asideSlicePx + randomInt(-34, 18)), 0, maxRightCrop)
                : randomInt(0, Math.min(28, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(14, maxTopCrop)),
                cropRightPx,
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(-4, 44)), 0, maxBottomCrop)
                    : randomInt(0, Math.min(58, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(22, maxLeftCrop)),
                asideSlicePx,
                traySlicePx: 0,
            });
        }
        case 'chat-with-tray-slice': {
            const traySlicePx = params.hasTray ? randomInt(4, Math.max(10, Math.min(38, Math.round(trayHeight * 0.9)))) : 0;
            const cropBottomPx = params.hasTray
                ? clamp(Math.round(params.rootHeight - trayTop - traySlicePx + randomInt(-2, 8)), 0, maxBottomCrop)
                : randomInt(0, Math.min(14, maxBottomCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(16, maxTopCrop)),
                cropRightPx: params.hasRightAside
                    ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-46, 90)), 0, maxRightCrop)
                    : randomInt(0, Math.min(34, maxRightCrop)),
                cropBottomPx,
                cropLeftPx: randomInt(0, Math.min(26, maxLeftCrop)),
                asideSlicePx: 0,
                traySlicePx,
            });
        }
        case 'tray-heavy': {
            const traySlicePx = params.hasTray ? randomInt(Math.max(8, Math.round(trayHeight * 0.35)), Math.max(10, Math.round(trayHeight))) : 0;
            const cropBottomPx = params.hasTray
                ? clamp(Math.round(params.rootHeight - trayTop - traySlicePx + randomInt(-3, 4)), 0, maxBottomCrop)
                : randomInt(0, Math.min(12, maxBottomCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(10, maxTopCrop)),
                cropRightPx: params.hasRightAside
                    ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-28, 48)), 0, maxRightCrop)
                    : randomInt(0, Math.min(20, maxRightCrop)),
                cropBottomPx,
                cropLeftPx: randomInt(0, Math.min(18, maxLeftCrop)),
                asideSlicePx: 0,
                traySlicePx,
            });
        }
        case 'left-offset':
            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(20, maxTopCrop)),
                cropRightPx: params.hasRightAside
                    ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-90, 130)), 0, maxRightCrop)
                    : randomInt(0, Math.min(52, maxRightCrop)),
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(-8, 48)), 0, maxBottomCrop)
                    : randomInt(4, Math.min(74, maxBottomCrop)),
                cropLeftPx: randomInt(Math.min(10, maxLeftCrop), Math.min(56, Math.max(10, maxLeftCrop))),
                asideSlicePx: params.hasRightAside ? Math.round(rightAsideWidth * randomFloat(0.15, 0.95)) : 0,
                traySlicePx: params.hasTray ? Math.round(trayHeight * randomFloat(0.15, 1)) : 0,
            });
        case 'tight-conversation':
            return normalizeFrame({
                mode,
                cropTopPx: randomInt(Math.min(6, maxTopCrop), Math.min(18, Math.max(6, maxTopCrop))),
                cropRightPx: params.hasRightAside
                    ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(18, 170)), 0, maxRightCrop)
                    : randomInt(10, Math.min(64, Math.max(10, maxRightCrop))),
                cropBottomPx: randomInt(18, Math.min(78, Math.max(18, maxBottomCrop))),
                cropLeftPx: randomInt(8, Math.min(34, Math.max(8, maxLeftCrop))),
                asideSlicePx: 0,
                traySlicePx: 0,
            });
        case 'slightly-cropped':
            return normalizeFrame({
                mode,
                cropTopPx: randomInt(1, Math.min(18, Math.max(1, maxTopCrop))),
                cropRightPx: randomInt(1, Math.min(58, Math.max(1, maxRightCrop))),
                cropBottomPx: randomInt(4, Math.min(58, Math.max(4, maxBottomCrop))),
                cropLeftPx: randomInt(1, Math.min(34, Math.max(1, maxLeftCrop))),
                asideSlicePx: 0,
                traySlicePx: 0,
            });
        case 'near-full':
        default:
            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(6, maxTopCrop)),
                cropRightPx: randomInt(0, Math.min(42, maxRightCrop)),
                cropBottomPx: randomInt(0, Math.min(30, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(18, maxLeftCrop)),
                asideSlicePx: params.hasRightAside ? Math.round(rightAsideWidth) : 0,
                traySlicePx: params.hasTray ? Math.round(trayHeight) : 0,
            });
    }
}

function pickCaptureMode(hasRightAside: boolean, hasTray: boolean): WhatsappDesktopCaptureMode {
    const value = randomUnit();

    if (hasRightAside && hasTray) {
        if (value < 0.12) {
            return 'near-full';
        }

        if (value < 0.22) {
            return 'aside-wide-visible';
        }

        if (value < 0.36) {
            return 'aside-mostly-visible';
        }

        if (value < 0.46) {
            return 'chat-main';
        }

        if (value < 0.56) {
            return 'wide-chat';
        }

        if (value < 0.68) {
            return 'chat-with-aside-slice';
        }

        if (value < 0.79) {
            return 'chat-with-deep-aside-slice';
        }

        if (value < 0.87) {
            return 'chat-with-tray-slice';
        }

        if (value < 0.94) {
            return 'tray-heavy';
        }

        return value < 0.98 ? 'left-offset' : 'tight-conversation';
    }

    if (hasRightAside) {
        if (value < 0.13) {
            return 'near-full';
        }

        if (value < 0.25) {
            return 'aside-wide-visible';
        }

        if (value < 0.43) {
            return 'aside-mostly-visible';
        }

        if (value < 0.56) {
            return 'chat-main';
        }

        if (value < 0.68) {
            return 'wide-chat';
        }

        if (value < 0.8) {
            return 'chat-with-aside-slice';
        }

        if (value < 0.91) {
            return 'chat-with-deep-aside-slice';
        }

        return value < 0.97 ? 'left-offset' : 'tight-conversation';
    }

    if (hasTray) {
        if (value < 0.2) {
            return 'near-full';
        }

        if (value < 0.43) {
            return 'chat-main';
        }

        if (value < 0.62) {
            return 'wide-chat';
        }

        if (value < 0.78) {
            return 'chat-with-tray-slice';
        }

        if (value < 0.91) {
            return 'tray-heavy';
        }

        return value < 0.97 ? 'left-offset' : 'tight-conversation';
    }

    if (value < 0.24) {
        return 'near-full';
    }

    if (value < 0.52) {
        return 'chat-main';
    }

    if (value < 0.74) {
        return 'wide-chat';
    }

    return value < 0.92 ? 'left-offset' : 'tight-conversation';
}

function buildFallbackCaptureFrame({
    rootWidth,
    rootHeight,
    header,
    messageViewport,
    rightAside,
    requiredRightAsideIdentity,
    tray,
}: {
    rootWidth: number;
    rootHeight: number;
    header: RelativeRect;
    messageViewport: RelativeRect;
    rightAside: RelativeRect | null;
    requiredRightAsideIdentity: RelativeRect | null;
    tray: RelativeRect | null;
}): WhatsappDesktopCaptureFrame {
    const maxBottomCrop = getMaxSafeBottomCrop(rootHeight, messageViewport);
    const maxRightCrop = Math.max(0, rootWidth - MIN_MESSAGE_VISIBLE_WIDTH_PX);
    const rightCropWithoutAside = requiredRightAsideIdentity
        ? Math.max(0, rootWidth - requiredRightAsideIdentity.right + 10)
        : rightAside
          ? Math.max(0, rootWidth - rightAside.left + 8)
          : 8;
    const bottomCropWithoutTray = tray ? Math.max(0, rootHeight - tray.top + 8) : 12;

    return normalizeFrame({
        mode: 'chat-main',
        cropTopPx: Math.min(4, getMaxSafeTopCrop(header)),
        cropRightPx: clamp(rightCropWithoutAside, 0, maxRightCrop),
        cropBottomPx: clamp(bottomCropWithoutTray, 0, maxBottomCrop),
        cropLeftPx: 0,
        asideSlicePx: 0,
        traySlicePx: 0,
    });
}

function isValidCaptureFrame(
    frame: WhatsappDesktopCaptureFrame,
    rootWidth: number,
    rootHeight: number,
    header: RelativeRect,
    messageViewport: RelativeRect,
    requiredRightAsideIdentity: RelativeRect | null,
): boolean {
    const captureRect: RelativeRect = {
        top: frame.cropTopPx,
        right: rootWidth - frame.cropRightPx,
        bottom: rootHeight - frame.cropBottomPx,
        left: frame.cropLeftPx,
        width: rootWidth - frame.cropLeftPx - frame.cropRightPx,
        height: rootHeight - frame.cropTopPx - frame.cropBottomPx,
    };

    if (captureRect.width < MIN_CAPTURE_WIDTH_PX || captureRect.height < MIN_CAPTURE_HEIGHT_PX) {
        return false;
    }

    const headerIntersection = getIntersection(captureRect, header);
    const messageIntersection = getIntersection(captureRect, messageViewport);
    const rightAsideIdentityIntersection = requiredRightAsideIdentity ? getIntersection(captureRect, requiredRightAsideIdentity) : null;

    return (
        headerIntersection.height >= MIN_HEADER_VISIBLE_HEIGHT_PX &&
        messageIntersection.height >= MIN_MESSAGE_VISIBLE_HEIGHT_PX &&
        messageIntersection.width >= MIN_MESSAGE_VISIBLE_WIDTH_PX &&
        (!rightAsideIdentityIntersection ||
            (rightAsideIdentityIntersection.height >= MIN_REQUIRED_RIGHT_ASIDE_IDENTITY_VISIBLE_HEIGHT_PX &&
                rightAsideIdentityIntersection.width >= MIN_REQUIRED_RIGHT_ASIDE_IDENTITY_VISIBLE_WIDTH_PX))
    );
}

function getMaxSafeTopCrop(header: RelativeRect): number {
    return Math.max(0, Math.floor(header.bottom - MIN_HEADER_VISIBLE_HEIGHT_PX));
}

function getMaxSafeBottomCrop(rootHeight: number, messageViewport: RelativeRect): number {
    return Math.max(0, Math.floor(rootHeight - messageViewport.top - MIN_MESSAGE_VISIBLE_HEIGHT_PX));
}

function toRelativeRect(rootRect: DOMRectReadOnly, rect: DOMRectReadOnly): RelativeRect {
    const left = Math.round(rect.left - rootRect.left);
    const top = Math.round(rect.top - rootRect.top);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    return {
        top,
        right: left + width,
        bottom: top + height,
        left,
        width,
        height,
    };
}

function getIntersection(first: RelativeRect, second: RelativeRect): RelativeRect {
    const left = Math.max(first.left, second.left);
    const top = Math.max(first.top, second.top);
    const right = Math.min(first.right, second.right);
    const bottom = Math.min(first.bottom, second.bottom);
    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);

    return { top, right, bottom, left, width, height };
}

function normalizeFrame(frame: WhatsappDesktopCaptureFrameInput): WhatsappDesktopCaptureFrame {
    return {
        version: 'desktop-capture-v1',
        mode: frame.mode,
        cropTopPx: Math.max(0, Math.round(frame.cropTopPx)),
        cropRightPx: Math.max(0, Math.round(frame.cropRightPx)),
        cropBottomPx: Math.max(0, Math.round(frame.cropBottomPx)),
        cropLeftPx: Math.max(0, Math.round(frame.cropLeftPx)),
        asideSlicePx: Math.max(0, Math.round(frame.asideSlicePx)),
        traySlicePx: Math.max(0, Math.round(frame.traySlicePx)),
    };
}

function randomInt(min: number, max: number): number {
    const normalizedMin = Math.ceil(Math.min(min, max));
    const normalizedMax = Math.floor(Math.max(min, max));

    return Math.floor(randomUnit() * (normalizedMax - normalizedMin + 1)) + normalizedMin;
}

function randomFloat(min: number, max: number): number {
    return min + randomUnit() * (max - min);
}

function randomUnit(): number {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const values = new Uint32Array(1);
        crypto.getRandomValues(values);

        return (values[0] ?? 0) / 0xffffffff;
    }

    return Math.random();
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
