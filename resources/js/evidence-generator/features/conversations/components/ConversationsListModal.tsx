import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ConversationListItem {
    id: number;
    code: string;
    messagesCount: number;
}

interface ConversationsListModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conversations: ConversationListItem[];
    onSelectConversation: (conversationId: number) => void;
}

export function ConversationsListModal({ open, onOpenChange, conversations, onSelectConversation }: ConversationsListModalProps) {
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
                                <button
                                    key={conversation.id}
                                    type="button"
                                    onClick={() => onSelectConversation(conversation.id)}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{conversation.code}</p>
                                            <p className="text-xs text-slate-500">Mensajes: {conversation.messagesCount}</p>
                                        </div>

                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                            #{index + 1}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
