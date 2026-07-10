import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ConversationStatus } from '../../../types';

interface ConversationListItem {
    id: number;
    code: string;
    status: ConversationStatus;
    messagesCount: number;
}

interface ConversationsListModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conversations: ConversationListItem[];
    onSelectConversation: (conversationId: number) => void;
    onChangeStatus: (conversationId: number, status: ConversationStatus) => void;
}

export function ConversationsListModal({ open, onOpenChange, conversations, onSelectConversation, onChangeStatus }: ConversationsListModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-0">
                <DialogHeader className="border-b border-slate-100 px-5 py-4">
                    <DialogTitle className="text-base font-semibold text-slate-900">Ver conversaciones</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Selecciona una conversación para cargarla en el formulario y editarla.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto p-4">
                    {conversations.length === 0 ? (
                        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
                            No hay conversaciones registradas.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {conversations.map((conversation, index) => (
                                <div key={conversation.id} className="rounded-md border border-slate-200 bg-white px-3 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onSelectConversation(conversation.id)}
                                            className="min-w-0 flex-1 cursor-pointer text-left"
                                        >
                                            <p className="text-sm font-semibold text-slate-900">{conversation.code}</p>
                                            <p className="text-xs text-slate-500">Mensajes: {conversation.messagesCount}</p>
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onChangeStatus(conversation.id, 'production')}
                                                className={[
                                                    'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded border px-2 text-[11px] font-bold transition',
                                                    conversation.status === 'production'
                                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
                                                ].join(' ')}
                                            >
                                                P
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onChangeStatus(conversation.id, 'development')}
                                                className={[
                                                    'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded border px-2 text-[11px] font-bold transition',
                                                    conversation.status === 'development'
                                                        ? 'border-amber-500 bg-amber-500 text-white'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
                                                ].join(' ')}
                                            >
                                                D
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onChangeStatus(conversation.id, 'fixed')}
                                                className={[
                                                    'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded border px-2 text-[11px] font-bold transition',
                                                    conversation.status === 'fixed'
                                                        ? 'border-red-600 bg-red-600 text-white'
                                                        : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
                                                ].join(' ')}
                                            >
                                                F
                                            </button>

                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
