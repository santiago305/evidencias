export interface TextSelection {
    start?: number | null;
    end?: number | null;
}

export interface InsertTextResult {
    text: string;
    selectionStart: number;
    selectionEnd: number;
}

export function insertTextAtSelection(text: string, insertion: string, start?: number | null, end?: number | null): InsertTextResult {
    const textLength = text.length;
    const safeStart = clampSelectionIndex(start, textLength);
    const safeEnd = clampSelectionIndex(end ?? safeStart, textLength);
    const normalizedStart = Math.min(safeStart, safeEnd);
    const normalizedEnd = Math.max(safeStart, safeEnd);
    const nextText = `${text.slice(0, normalizedStart)}${insertion}${text.slice(normalizedEnd)}`;
    const nextCursor = normalizedStart + insertion.length;

    return {
        text: nextText,
        selectionStart: nextCursor,
        selectionEnd: nextCursor,
    };
}

function clampSelectionIndex(value: number | null | undefined, textLength: number): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return textLength;
    }

    if (value < 0) {
        return 0;
    }

    if (value > textLength) {
        return textLength;
    }

    return value;
}
