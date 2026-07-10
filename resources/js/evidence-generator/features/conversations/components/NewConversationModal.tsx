import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ConversationStatus } from '../../../types';
import { insertTextAtSelection } from '../conversationInsertion';
import type { ConversationVariable } from '../conversationVariables';

interface ConversationDraftMessage {
    id: string;
    side: 'in' | 'out';
    replyToPosition: number | null;
    linesText: string;
}

interface SelectionRange {
    start: number;
    end: number;
}

export interface NewConversationPayload {
    status: ConversationStatus;
    messages: Array<{
        side: 'in' | 'out';
        reply_to_position?: number | null;
        lines: string[];
    }>;
}

export interface ConversationModalMessageDraft {
    side: 'in' | 'out';
    replyToPosition?: number | null;
    lines: string[];
}

interface NewConversationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: NewConversationPayload) => Promise<void>;
    isSubmitting: boolean;
    errorMessage: string | null;
    mode?: 'create' | 'edit';
    initialMessages?: ConversationModalMessageDraft[];
    conversationCode?: string | null;
    initialStatus?: ConversationStatus;
    variables: ConversationVariable[];
}

const createMessageId = () => Math.random().toString(36).slice(2);

const createEmptyMessage = (): ConversationDraftMessage => ({
    id: createMessageId(),
    side: 'out',
    replyToPosition: null,
    linesText: '',
});

const getStatusDescription = (status: ConversationStatus): string => {
    if (status === 'production') {
        return 'Producción: entra en generación aleatoria';
    }

    if (status === 'fixed') {
        return 'Fijo: se usa siempre al generar evidencias normales';
    }

    return 'Desarrollo: solo por código';
};

export function NewConversationModal({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
    errorMessage,
    mode = 'create',
    initialMessages = [],
    conversationCode = null,
    initialStatus = 'development',
    variables,
}: NewConversationModalProps) {
    const [messages, setMessages] = useState<ConversationDraftMessage[]>([createEmptyMessage()]);
    const [status, setStatus] = useState<ConversationStatus>('development');
    const [collapsedMessages, setCollapsedMessages] = useState<Record<string, boolean>>({});
    const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
    const selectionRefs = useRef<Record<string, SelectionRange | null>>({});

    const mapDraftMessages = (sourceMessages: ConversationModalMessageDraft[]): ConversationDraftMessage[] => {
        if (sourceMessages.length === 0) {
            return [createEmptyMessage()];
        }

        return sourceMessages.map((message) => ({
            id: createMessageId(),
            side: message.side,
            replyToPosition: message.replyToPosition ?? null,
            linesText: message.lines.join('\n'),
        }));
    };

    const canSubmit = useMemo(() => {
        return messages.length > 0 && messages.every((message) => message.linesText.trim() !== '');
    }, [messages]);

    const updateMessage = (id: string, patch: Partial<ConversationDraftMessage>) => {
        setMessages((previous) => previous.map((message) => (message.id === id ? { ...message, ...patch } : message)));
    };

    const captureSelection = (messageId: string) => {
        const textarea = textareaRefs.current[messageId];

        if (textarea === null || textarea === undefined) {
            return;
        }

        const { selectionStart, selectionEnd } = textarea;

        if (typeof selectionStart !== 'number' || typeof selectionEnd !== 'number') {
            return;
        }

        selectionRefs.current[messageId] = {
            start: selectionStart,
            end: selectionEnd,
        };
    };

    const getSelectionForInsertion = (messageId: string): SelectionRange | null => {
        const storedSelection = selectionRefs.current[messageId];

        if (storedSelection !== null && storedSelection !== undefined) {
            return storedSelection;
        }

        const textarea = textareaRefs.current[messageId];

        if (textarea === null || textarea === undefined) {
            return null;
        }

        const { selectionStart, selectionEnd } = textarea;

        if (typeof selectionStart !== 'number' || typeof selectionEnd !== 'number') {
            return null;
        }

        return {
            start: selectionStart,
            end: selectionEnd,
        };
    };

    const addMessage = () => {
        setMessages((previous) => [...previous, createEmptyMessage()]);
    };

    const removeMessage = (id: string) => {
        setMessages((previous) => {
            if (previous.length === 1) {
                return previous;
            }

            const removedIndex = previous.findIndex((message) => message.id === id);
            const removedPosition = removedIndex + 1;

            return previous
                .filter((message) => message.id !== id)
                .map((message) => {
                    if (message.replyToPosition === null) {
                        return message;
                    }

                    if (message.replyToPosition === removedPosition) {
                        return { ...message, replyToPosition: null };
                    }

                    if (message.replyToPosition > removedPosition) {
                        return { ...message, replyToPosition: message.replyToPosition - 1 };
                    }

                    return message;
                });
        });

        setCollapsedMessages((previous) => {
            const next = { ...previous };
            delete next[id];
            return next;
        });

        delete selectionRefs.current[id];
    };

    const toggleCollapsed = (id: string) => {
        setCollapsedMessages((previous) => ({
            ...previous,
            [id]: !previous[id],
        }));
    };

    const insertVariable = (messageId: string, placeholder: string) => {
        const textarea = textareaRefs.current[messageId];
        const selection = getSelectionForInsertion(messageId);
        const currentMessage = messages.find((message) => message.id === messageId);

        if (!currentMessage) {
            return;
        }

        const result = insertTextAtSelection(currentMessage.linesText, placeholder, selection?.start, selection?.end);
        const selectionToRestore: SelectionRange = {
            start: result.selectionStart,
            end: result.selectionEnd,
        };

        setMessages((previous) =>
            previous.map((message) =>
                message.id === messageId
                    ? {
                          ...message,
                          linesText: result.text,
                      }
                    : message,
            ),
        );

        if (textarea !== null) {
            window.requestAnimationFrame(() => {
                textarea.focus();
                textarea.setSelectionRange(selectionToRestore.start, selectionToRestore.end);
                selectionRefs.current[messageId] = selectionToRestore;
            });
        }
    };

    const resetForm = () => {
        setMessages(mapDraftMessages(initialMessages));
        setStatus(initialStatus);
        setCollapsedMessages({});
        selectionRefs.current = {};
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        setMessages(mapDraftMessages(initialMessages));
        setStatus(initialStatus);
        setCollapsedMessages({});
        selectionRefs.current = {};
    }, [initialMessages, initialStatus, open]);

    const handleSubmit = async () => {
        if (!canSubmit) {
            return;
        }

        const payload: NewConversationPayload = {
            status,
            messages: messages.map((message) => ({
                side: message.side,
                reply_to_position: message.replyToPosition,
                lines: message.linesText
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0),
            })),
        };

        await onSubmit(payload);
        resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl overflow-hidden p-0">
                <DialogHeader className="border-b border-slate-100 px-5 py-4">
                    <DialogTitle className="text-base font-semibold text-slate-900">
                        {mode === 'edit' ? 'Editar conversación' : 'Nueva conversación'}
                    </DialogTitle>
                    {mode === 'edit' && conversationCode ? <p className="text-sm text-slate-500">Código: {conversationCode}</p> : null}
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setStatus('production')}
                            className={[
                                'inline-flex h-8 cursor-pointer items-center rounded-md border px-3 text-xs font-bold transition',
                                status === 'production'
                                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                            ].join(' ')}
                        >
                            P
                        </button>

                        <button
                            type="button"
                            onClick={() => setStatus('development')}
                            className={[
                                'inline-flex h-8 cursor-pointer items-center rounded-md border px-3 text-xs font-bold transition',
                                status === 'development'
                                    ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
                            ].join(' ')}
                        >
                            D
                        </button>

                        <button
                            type="button"
                            onClick={() => setStatus('fixed')}
                            className={[
                                'inline-flex h-8 cursor-pointer items-center rounded-md border px-3 text-xs font-bold transition',
                                status === 'fixed'
                                    ? 'border-red-600 bg-red-600 text-white shadow-sm'
                                    : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
                            ].join(' ')}
                        >
                            F
                        </button>

                        <span className="text-xs text-slate-500">{getStatusDescription(status)}</span>
                    </div>
                </DialogHeader>

                <div className="max-h-[72vh] overflow-y-auto px-5 py-4">
                    <div className="space-y-2">
                        {messages.map((message, index) => {
                            const isCollapsed = Boolean(collapsedMessages[message.id]);

                            const firstLine =
                                message.linesText
                                    .split('\n')
                                    .map((line) => line.trim())
                                    .find(Boolean) || 'Sin mensaje';
                            const replyTarget =
                                message.replyToPosition !== null && message.replyToPosition > 0 ? messages[message.replyToPosition - 1] : null;
                            const replyTargetLabel = replyTarget ? `Responde a mensaje ${message.replyToPosition}` : null;
                            const previousMessages = messages.slice(0, index);

                            return (
                                <div key={message.id} className="rounded-lg border border-slate-200 bg-white">
                                    <div className="flex items-center gap-2 px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleCollapsed(message.id)}
                                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                        >
                                            {isCollapsed ? '+' : '-'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleCollapsed(message.id)}
                                            className="min-w-0 flex-1 cursor-pointer text-left"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-900">Mensaje {index + 1}</span>

                                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                                    {message.side === 'out' ? 'Asesor' : 'Cliente'}
                                                </span>

                                                {replyTargetLabel ? (
                                                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                                                        {replyTargetLabel}
                                                    </span>
                                                ) : null}
                                            </div>

                                            {isCollapsed ? <p className="mt-0.5 truncate text-xs text-slate-400">{firstLine}</p> : null}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => removeMessage(message.id)}
                                            disabled={messages.length === 1}
                                            className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    {!isCollapsed ? (
                                        <div className="border-t border-slate-100 p-3 pt-2">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <select
                                                    value={message.side}
                                                    onChange={(event) =>
                                                        updateMessage(message.id, {
                                                            side: event.target.value as 'in' | 'out',
                                                        })
                                                    }
                                                    className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-slate-400"
                                                >
                                                    <option value="out">Asesor</option>
                                                    <option value="in">Cliente</option>
                                                </select>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button type="button" variant="outline" size="sm" className="h-8 px-2 text-xs">
                                                            Responder
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="start" className="w-80">
                                                        <DropdownMenuLabel>Responder a</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                updateMessage(message.id, {
                                                                    replyToPosition: null,
                                                                })
                                                            }
                                                            className="py-2"
                                                        >
                                                            <span className="text-xs font-medium text-slate-700">Sin respuesta</span>
                                                        </DropdownMenuItem>

                                                        {previousMessages.length > 0 ? <DropdownMenuSeparator /> : null}

                                                        {previousMessages.map((targetMessage, targetIndex) => {
                                                            const targetPosition = targetIndex + 1;
                                                            const targetFirstLine =
                                                                targetMessage.linesText
                                                                    .split('\n')
                                                                    .map((line) => line.trim())
                                                                    .find(Boolean) || 'Sin mensaje';

                                                            return (
                                                                <DropdownMenuItem
                                                                    key={targetMessage.id}
                                                                    onSelect={() =>
                                                                        updateMessage(message.id, {
                                                                            replyToPosition: targetPosition,
                                                                        })
                                                                    }
                                                                    className="items-start py-2"
                                                                >
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-semibold text-slate-900">
                                                                                Mensaje {targetPosition}
                                                                            </span>
                                                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                                                                {targetMessage.side === 'out' ? 'Asesor' : 'Cliente'}
                                                                            </span>
                                                                        </div>
                                                                        <p className="mt-0.5 truncate text-xs text-slate-500">{targetFirstLine}</p>
                                                                    </div>
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs"
                                                            onMouseDown={() => captureSelection(message.id)}
                                                        >
                                                            Variables
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent align="start" className="w-72">
                                                        <DropdownMenuLabel>Variables disponibles</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        {variables.map((variable) => (
                                                            <DropdownMenuItem
                                                                key={variable.key}
                                                                onSelect={() => insertVariable(message.id, variable.placeholder)}
                                                                className="py-2"
                                                            >
                                                                <span className="font-mono text-xs font-medium text-slate-900">
                                                                    {variable.placeholder}
                                                                </span>
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <textarea
                                                ref={(element) => {
                                                    textareaRefs.current[message.id] = element;
                                                }}
                                                onSelect={() => captureSelection(message.id)}
                                                onMouseUp={() => captureSelection(message.id)}
                                                onKeyUp={() => captureSelection(message.id)}
                                                onClick={() => captureSelection(message.id)}
                                                onBlur={() => captureSelection(message.id)}
                                                value={message.linesText}
                                                onChange={(event) =>
                                                    updateMessage(message.id, {
                                                        linesText: event.target.value,
                                                    })
                                                }
                                                rows={3}
                                                placeholder="Escribe el mensaje..."
                                                className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={addMessage}
                        className="mt-3 w-full cursor-pointer rounded-md border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    >
                        + Agregar mensaje
                    </button>

                    {errorMessage ? <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</div> : null}
                </div>

                <DialogFooter className="border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : 'Guardar'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
