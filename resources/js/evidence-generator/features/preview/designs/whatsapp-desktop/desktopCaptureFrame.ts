import type { CSSProperties } from 'react';

export type WhatsappDesktopCaptureMode =
    | 'near-full'
    | 'chat-main'
    | 'chat-with-aside-slice'
    | 'chat-with-tray-slice'
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

const MAX_RANDOM_ATTEMPTS = 18;
const MIN_CAPTURE_WIDTH_PX = 360;
const MIN_CAPTURE_HEIGHT_PX = 260;
const MIN_HEADER_VISIBLE_HEIGHT_PX = 26;
const MIN_MESSAGE_VISIBLE_HEIGHT_PX = 150;
const MIN_MESSAGE_VISIBLE_WIDTH_PX = 300;

export function buildRandomDesktopCaptureFrame({
    rootRect,
    headerRect,
    messageViewportRect,
    rightAsideRect = null,
    trayRect = null,
}: BuildRandomDesktopCaptureFrameParams): WhatsappDesktopCaptureFrame {
    const rootWidth = Math.max(0, Math.round(rootRect.width));
    const rootHeight = Math.max(0, Math.round(rootRect.height));
    const header = toRelativeRect(rootRect, headerRect);
    const messageViewport = toRelativeRect(rootRect, messageViewportRect);
    const rightAside = rightAsideRect ? toRelativeRect(rootRect, rightAsideRect) : null;
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

        if (isValidCaptureFrame(frame, rootWidth, rootHeight, header, messageViewport)) {
            return frame;
        }
    }

    return buildFallbackCaptureFrame({ rootWidth, rootHeight, header, messageViewport, rightAside, tray });
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
    const maxLeftCrop = Math.min(30, Math.max(0, params.messageViewport.right - MIN_MESSAGE_VISIBLE_WIDTH_PX));
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
                ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-8, 24)), 0, maxRightCrop)
                : randomInt(0, Math.min(24, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(10, maxTopCrop)),
                cropRightPx,
                cropBottomPx: params.hasTray
                    ? clamp(Math.round(params.rootHeight - trayTop + randomInt(4, 28)), 0, maxBottomCrop)
                    : randomInt(18, Math.min(54, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(18, maxLeftCrop)),
                asideSlicePx: 0,
                traySlicePx: 0,
            });
        }
        case 'chat-with-aside-slice': {
            const asideSlicePx = params.hasRightAside
                ? randomInt(28, Math.max(32, Math.min(170, Math.round(rightAsideWidth * 0.62))))
                : 0;
            const cropRightPx = params.hasRightAside
                ? clamp(Math.round(params.rootWidth - rightAsideStart - asideSlicePx + randomInt(-8, 10)), 0, maxRightCrop)
                : randomInt(0, Math.min(18, maxRightCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(12, maxTopCrop)),
                cropRightPx,
                cropBottomPx: randomInt(16, Math.min(48, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(16, maxLeftCrop)),
                asideSlicePx,
                traySlicePx: 0,
            });
        }
        case 'chat-with-tray-slice': {
            const traySlicePx = params.hasTray ? randomInt(8, Math.max(10, Math.min(38, Math.round(trayHeight * 0.8)))) : 0;
            const cropBottomPx = params.hasTray
                ? clamp(Math.round(params.rootHeight - trayTop - traySlicePx + randomInt(0, 5)), 0, maxBottomCrop)
                : randomInt(0, Math.min(14, maxBottomCrop));

            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(10, maxTopCrop)),
                cropRightPx: params.hasRightAside
                    ? clamp(Math.round(params.rootWidth - rightAsideStart + randomInt(-10, 36)), 0, maxRightCrop)
                    : randomInt(0, Math.min(16, maxRightCrop)),
                cropBottomPx,
                cropLeftPx: randomInt(0, Math.min(14, maxLeftCrop)),
                asideSlicePx: 0,
                traySlicePx,
            });
        }
        case 'slightly-cropped':
            return normalizeFrame({
                mode,
                cropTopPx: randomInt(2, Math.min(24, Math.max(2, maxTopCrop))),
                cropRightPx: randomInt(2, Math.min(34, Math.max(2, maxRightCrop))),
                cropBottomPx: randomInt(6, Math.min(42, Math.max(6, maxBottomCrop))),
                cropLeftPx: randomInt(2, Math.min(28, Math.max(2, maxLeftCrop))),
                asideSlicePx: 0,
                traySlicePx: 0,
            });
        case 'near-full':
        default:
            return normalizeFrame({
                mode,
                cropTopPx: randomInt(0, Math.min(8, maxTopCrop)),
                cropRightPx: randomInt(0, Math.min(10, maxRightCrop)),
                cropBottomPx: randomInt(0, Math.min(10, maxBottomCrop)),
                cropLeftPx: randomInt(0, Math.min(8, maxLeftCrop)),
                asideSlicePx: params.hasRightAside ? Math.round(rightAsideWidth) : 0,
                traySlicePx: params.hasTray ? Math.round(trayHeight) : 0,
            });
    }
}

function pickCaptureMode(hasRightAside: boolean, hasTray: boolean): WhatsappDesktopCaptureMode {
    const value = randomUnit();

    if (hasRightAside && hasTray) {
        if (value < 0.26) {
            return 'near-full';
        }

        if (value < 0.48) {
            return 'chat-main';
        }

        if (value < 0.72) {
            return 'chat-with-aside-slice';
        }

        if (value < 0.9) {
            return 'chat-with-tray-slice';
        }

        return 'slightly-cropped';
    }

    if (hasRightAside) {
        if (value < 0.3) {
            return 'near-full';
        }

        if (value < 0.62) {
            return 'chat-main';
        }

        if (value < 0.84) {
            return 'chat-with-aside-slice';
        }

        return 'slightly-cropped';
    }

    if (hasTray) {
        if (value < 0.34) {
            return 'near-full';
        }

        if (value < 0.62) {
            return 'chat-main';
        }

        if (value < 0.86) {
            return 'chat-with-tray-slice';
        }

        return 'slightly-cropped';
    }

    if (value < 0.4) {
        return 'near-full';
    }

    if (value < 0.76) {
        return 'chat-main';
    }

    return 'slightly-cropped';
}

function buildFallbackCaptureFrame({
    rootWidth,
    rootHeight,
    header,
    messageViewport,
    rightAside,
    tray,
}: {
    rootWidth: number;
    rootHeight: number;
    header: RelativeRect;
    messageViewport: RelativeRect;
    rightAside: RelativeRect | null;
    tray: RelativeRect | null;
}): WhatsappDesktopCaptureFrame {
    const maxBottomCrop = getMaxSafeBottomCrop(rootHeight, messageViewport);
    const maxRightCrop = Math.max(0, rootWidth - MIN_MESSAGE_VISIBLE_WIDTH_PX);
    const rightCropWithoutAside = rightAside ? Math.max(0, rootWidth - rightAside.left + 8) : 8;
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

    return (
        headerIntersection.height >= MIN_HEADER_VISIBLE_HEIGHT_PX &&
        messageIntersection.height >= MIN_MESSAGE_VISIBLE_HEIGHT_PX &&
        messageIntersection.width >= MIN_MESSAGE_VISIBLE_WIDTH_PX
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
