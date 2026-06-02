import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { pickRandomClientProfile } from './config/whatsapp/clientProfiles';
import { pickRandomModoEntrada } from './config/whatsapp/conversationModes';
import { ConversationsListModal } from './features/conversations/components/ConversationsListModal';
import {
    NewConversationModal,
    type ConversationModalMessageDraft,
    type NewConversationPayload,
} from './features/conversations/components/NewConversationModal';
import { buildConversationVariables } from './features/conversations/conversationVariables';
import { FormPanel } from './features/editor/components/FormPanel';
import { PreviewPanel } from './features/preview/components/PreviewPanel';
import { getJson, postJson, putJson } from './lib/api';
import { createInitialFormState } from './lib/formState';
import type { ActiveDesign, ConversationProgressSummary, FormState, GeneratedMessage, SavedData, WindowsTrayProfile } from './types';

interface CurrentUser {
    name: string;
    dni: string;
}

interface AppProps {
    currentUser: CurrentUser;
}

interface ConversationsIndexResponse {
    data: ConversationApiModel[];
}

interface ConversationApiModel {
    id: number;
    code: string;
    messages: Array<{
        side: 'in' | 'out';
        lines: string[];
    }>;
}

interface GenerateEvidenceResponse {
    conversationId: string;
    seedCode: string;
    messages: GeneratedMessage[];
    previewSnapshot: SavedData['previewSnapshot'];
    progress: ConversationProgressSummary;
    trayProfile: WindowsTrayProfile;
}

interface StoreConversationResponse {
    message: string;
    data: {
        id: number;
        code: string;
    };
}

interface ConversationListItem {
    id: number;
    code: string;
    messages: ConversationModalMessageDraft[];
}

/* ---------------- App ---------------- */
// Componente raiz que coordina estado, tabs y vistas.
export default function App({ currentUser }: AppProps) {
    const [activeDesign, setActiveDesign] = useState<ActiveDesign>('whatsapp');
    const [form, setForm] = useState<FormState>(() => createInitialFormState());

    const [saved, setSaved] = useState<SavedData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSeedCode, setGeneratedSeedCode] = useState('');
    const [seedCodeInput, setSeedCodeInput] = useState('');
    const [progress, setProgress] = useState<ConversationProgressSummary | null>(null);
    const [conversationsCount, setConversationsCount] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
    const [isConversationsListModalOpen, setIsConversationsListModalOpen] = useState(false);
    const [isSavingConversation, setIsSavingConversation] = useState(false);
    const [conversationModalError, setConversationModalError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [editingConversation, setEditingConversation] = useState<ConversationListItem | null>(null);

    const handleChange = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const loadConversations = async () => {
        try {
            const response = await getJson<ConversationsIndexResponse>(route('conversations.index'));
            const normalizedConversations: ConversationListItem[] = response.data.map((conversation) => ({
                id: conversation.id,
                code: conversation.code,
                messages: conversation.messages.map((message) => ({
                    side: message.side,
                    lines: message.lines,
                })),
            }));

            setConversations(normalizedConversations);
            setConversationsCount(normalizedConversations.length);
        } catch {
            setFeedbackMessage('No se pudo cargar el listado de conversaciones.');
        }
    };

    useEffect(() => {
        void loadConversations();
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setFeedbackMessage(null);

        try {
            const response = await postJson<GenerateEvidenceResponse>(route('evidences.generate'), {
                ...form,
                ...(seedCodeInput.trim() !== '' ? { seedCode: seedCodeInput.trim() } : {}),
            });

            setSaved({
                ...form,
                nombreAsesor: currentUser.name,
                dni: currentUser.dni,
                modoEntrada: pickRandomModoEntrada(),
                tipoCliente: pickRandomClientProfile(),
                conversationId: response.conversationId,
                seedCode: response.seedCode,
                generatedMessages: response.messages,
                previewSnapshot: response.previewSnapshot,
                progress: response.progress,
                trayProfile: response.trayProfile,
            });
            setGeneratedSeedCode(response.seedCode);
            setProgress(response.progress);
            setFeedbackMessage(`Conversacion usada: ${response.conversationId}`);
            setForm(createInitialFormState());
            setSeedCodeInput('');
        } catch (error) {
            const errorPayload = error as {
                errors?: Record<string, string[]>;
                message?: string;
            };
            const firstError = errorPayload?.errors && Object.values(errorPayload.errors)[0] && Object.values(errorPayload.errors)[0][0];

            setFeedbackMessage(firstError ?? errorPayload?.message ?? 'No se pudo generar la evidencia.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateConversation = async (payload: NewConversationPayload) => {
        setIsSavingConversation(true);
        setConversationModalError(null);

        try {
            const isEditingConversation = editingConversation !== null;
            const response = isEditingConversation
                ? await putJson<StoreConversationResponse>(
                      route('conversations.update', { conversation: editingConversation.id }),
                      payload,
                  )
                : await postJson<StoreConversationResponse>(route('conversations.store'), payload);

            setIsConversationModalOpen(false);
            setEditingConversation(null);
            setFeedbackMessage(
                isEditingConversation
                    ? `Conversacion ${response.data.code} actualizada correctamente.`
                    : `Conversacion ${response.data.code} guardada correctamente.`,
            );
            await loadConversations();
        } catch (error) {
            const errorPayload = error as {
                errors?: Record<string, string[]>;
                message?: string;
            };
            const firstError = errorPayload?.errors && Object.values(errorPayload.errors)[0] && Object.values(errorPayload.errors)[0][0];

            setConversationModalError(firstError ?? errorPayload?.message ?? 'No se pudo guardar la conversacion.');
        } finally {
            setIsSavingConversation(false);
        }
    };

    const tabItems = useMemo(
        () =>
            [
                { key: 'whatsapp' as const, label: 'WhatsApp', accent: 'bg-emerald-600' },
                { key: 'llamada' as const, label: 'Llamada', accent: 'bg-sky-600' },
                { key: 'sms' as const, label: 'SMS', accent: 'bg-indigo-600' },
            ] as const,
        [],
    );

    const conversationVariables = useMemo(
        () => buildConversationVariables(form, currentUser.name),
        [form, currentUser.name],
    );

    return (
        <div className="h-screen w-full bg-slate-50">
            <div className="h-full w-full">
                <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-8">
                    <PreviewPanel activeDesign={activeDesign} saved={saved} />
                    <FormPanel
                        activeDesign={activeDesign}
                        form={form}
                        saved={saved}
                        tabItems={tabItems}
                        onSelectDesign={setActiveDesign}
                        onChange={handleChange}
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
                        generatedSeedCode={generatedSeedCode}
                        seedCodeInput={seedCodeInput}
                        onSeedCodeInputChange={setSeedCodeInput}
                        progress={progress}
                        conversationsCount={conversationsCount}
                        onOpenConversationModal={() => {
                            setEditingConversation(null);
                            setConversationModalError(null);
                            setIsConversationModalOpen(true);
                        }}
                        onOpenConversationsListModal={() => {
                            setIsConversationsListModalOpen(true);
                        }}
                        feedbackMessage={feedbackMessage}
                    />
                </div>
            </div>

            <NewConversationModal
                open={isConversationModalOpen}
                onOpenChange={(open) => {
                    setIsConversationModalOpen(open);
                    if (!open) {
                        setConversationModalError(null);
                        setEditingConversation(null);
                    }
                }}
                onSubmit={handleCreateConversation}
                isSubmitting={isSavingConversation}
                errorMessage={conversationModalError}
                mode={editingConversation ? 'edit' : 'create'}
                initialMessages={editingConversation?.messages ?? []}
                conversationCode={editingConversation?.code ?? null}
                variables={conversationVariables}
            />

            <ConversationsListModal
                open={isConversationsListModalOpen}
                onOpenChange={setIsConversationsListModalOpen}
                conversations={conversations.map((conversation) => ({
                    id: conversation.id,
                    code: conversation.code,
                    messagesCount: conversation.messages.length,
                }))}
                onSelectConversation={(conversationId) => {
                    const selectedConversation = conversations.find((conversation) => conversation.id === conversationId);
                    if (!selectedConversation) {
                        return;
                    }

                    setEditingConversation(selectedConversation);
                    setConversationModalError(null);
                    setIsConversationsListModalOpen(false);
                    setIsConversationModalOpen(true);
                }}
            />
        </div>
    );
}
