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
import { resolveActiveMobileDesignKey } from './lib/mobileDesignSelection';
import { applyConversationTestDefaults } from './lib/testingDefaults';
import type {
    ActiveDesign,
    ConversationProgressSummary,
    ConversationStatus,
    FormState,
    GeneratedMessage,
    MobileDesignKey,
    PreviewDeviceMode,
    PreviewThemeMode,
    SavedData,
    WhatsappDesktopScale,
    WindowsTrayProfile,
} from './types';

interface CurrentUser {
    name: string;
    dni: string;
    sexualidad: 'M' | 'F';
}

interface AppProps {
    currentUser?: CurrentUser;
    availableMobileDesigns?: MobileDesignKey[];
    globalMobileDesigns?: MobileDesignKey[];
    registeredMobileDesigns?: MobileDesignKey[];
    whatsappDesktopScale?: WhatsappDesktopScale;
    evidenceThemeMode?: PreviewThemeMode;
    evidenceDeviceMode?: PreviewDeviceMode;
}

interface ConversationsIndexResponse {
    data: ConversationApiModel[];
}

interface ConversationApiModel {
    id: number;
    code: string;
    status: ConversationStatus;
    messages: Array<{
        side: 'in' | 'out';
        reply_to_position?: number | null;
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
        status: ConversationStatus;
    };
}

interface StoreMobileDesignResponse {
    message: string;
    data: {
        id: number;
        design_key: MobileDesignKey;
    };
}

interface ConversationListItem {
    id: number;
    code: string;
    status: ConversationStatus;
    messages: ConversationModalMessageDraft[];
}

/* ---------------- App ---------------- */
// Componente raiz que coordina estado, tabs y vistas.
export default function App({
    currentUser,
    availableMobileDesigns = ['mobile-1'],
    globalMobileDesigns = [],
    registeredMobileDesigns = [],
    whatsappDesktopScale = 80,
    evidenceThemeMode = 'light',
    evidenceDeviceMode = 'desktop',
}: AppProps) {
    const resolvedCurrentUser = currentUser ?? {
        name: 'Maria Perez',
        dni: '00000000',
        sexualidad: 'F' as const,
    };
    const [activeDesign, setActiveDesign] = useState<ActiveDesign>('whatsapp');
    const previewThemeMode = evidenceThemeMode;
    const [form, setForm] = useState<FormState>(() => createInitialFormState());

    const [saved, setSaved] = useState<SavedData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSeedCode, setGeneratedSeedCode] = useState('');
    const [seedCodeInput, setSeedCodeInput] = useState('');
    const [conversationCodeInput, setConversationCodeInput] = useState('');
    const [progress, setProgress] = useState<ConversationProgressSummary | null>(null);
    const [conversationsCount, setConversationsCount] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [globalMobileDesignKeys, setGlobalMobileDesignKeys] = useState<MobileDesignKey[]>(globalMobileDesigns);
    const [isRegisteringMobileDesign, setIsRegisteringMobileDesign] = useState(false);
    const [lastGeneratedFromConversationCode, setLastGeneratedFromConversationCode] = useState(false);
    const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
    const [isConversationsListModalOpen, setIsConversationsListModalOpen] = useState(false);
    const [isSavingConversation, setIsSavingConversation] = useState(false);
    const [conversationModalError, setConversationModalError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [editingConversation, setEditingConversation] = useState<ConversationListItem | null>(null);

    const hasRegisteredMobileDesign = registeredMobileDesigns.length > 0;
    const whatsappPreviewMode: PreviewDeviceMode = hasRegisteredMobileDesign ? evidenceDeviceMode : 'desktop';
    const testMobileDesignKey = resolveActiveMobileDesignKey({
        availableMobileDesigns,
        globalMobileDesigns: globalMobileDesignKeys,
        registeredMobileDesigns,
    });
    const userMobileDesignKey = resolveActiveMobileDesignKey({
        availableMobileDesigns,
        globalMobileDesigns: globalMobileDesignKeys,
        registeredMobileDesigns,
        preferPendingDevelopmentDesign: false,
    });
    const isTestingConversation = conversationCodeInput.trim() !== '';
    const shouldUseTestMobileDesign = isTestingConversation || lastGeneratedFromConversationCode;
    const activeMobileDesignKey = shouldUseTestMobileDesign ? testMobileDesignKey : userMobileDesignKey;
    const isTestMobileDesignGloballyRegistered = globalMobileDesignKeys.includes(testMobileDesignKey);

    const handleChange = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = key === 'dniCliente' ? e.target.value.replace(/\D/g, '').slice(0, 8) : e.target.value;

        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const loadConversations = async () => {
        try {
            const response = await getJson<ConversationsIndexResponse>(route('conversations.index'));
            const normalizedConversations: ConversationListItem[] = response.data.map((conversation) => ({
                id: conversation.id,
                code: conversation.code,
                status: conversation.status,
                messages: conversation.messages.map((message) => ({
                    side: message.side,
                    replyToPosition: message.reply_to_position ?? null,
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

    useEffect(() => {
        if (!hasRegisteredMobileDesign && activeDesign !== 'whatsapp') {
            setActiveDesign('whatsapp');
        }
    }, [activeDesign, hasRegisteredMobileDesign]);

    useEffect(() => {
        if (conversationCodeInput.trim() === '' || seedCodeInput.trim() !== '') {
            return;
        }

        setForm((previous) => applyConversationTestDefaults(previous));
    }, [conversationCodeInput, seedCodeInput]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setFeedbackMessage(null);
        const shouldUseConversationDefaults = seedCodeInput.trim() === '' && conversationCodeInput.trim() !== '';
        const requestForm = shouldUseConversationDefaults ? applyConversationTestDefaults(form) : form;

        try {
            const response = await postJson<GenerateEvidenceResponse>(route('evidences.generate'), {
                ...requestForm,
                ...(seedCodeInput.trim() !== '' ? { seedCode: seedCodeInput.trim() } : {}),
                ...(seedCodeInput.trim() === '' && conversationCodeInput.trim() !== '' ? { conversationCode: conversationCodeInput.trim() } : {}),
            });

            setLastGeneratedFromConversationCode(shouldUseConversationDefaults);
            setSaved({
                ...requestForm,
                nombreAsesor: resolvedCurrentUser.name,
                dni: resolvedCurrentUser.dni,
                sexualidadAsesor: resolvedCurrentUser.sexualidad,
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
            setConversationCodeInput('');
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

    const handleRegisterMobileDesign = async () => {
        setIsRegisteringMobileDesign(true);
        setFeedbackMessage(null);

        try {
            const response = await postJson<StoreMobileDesignResponse>(route('mobile-designs.store'), {
                design_key: activeMobileDesignKey,
            });

            setGlobalMobileDesignKeys((previous) =>
                previous.includes(response.data.design_key) ? previous : [...previous, response.data.design_key],
            );
            setFeedbackMessage(`${response.message} Ahora puedes asignarlo desde Perfil.`);
        } catch (error) {
            const errorPayload = error as {
                errors?: Record<string, string[]>;
                message?: string;
            };
            const firstError = errorPayload?.errors && Object.values(errorPayload.errors)[0] && Object.values(errorPayload.errors)[0][0];

            setFeedbackMessage(firstError ?? errorPayload?.message ?? 'No se pudo registrar el diseño móvil.');
        } finally {
            setIsRegisteringMobileDesign(false);
        }
    };

    const handleCreateConversation = async (payload: NewConversationPayload) => {
        setIsSavingConversation(true);
        setConversationModalError(null);

        try {
            const isEditingConversation = editingConversation !== null;
            const response = isEditingConversation
                ? await putJson<StoreConversationResponse>(route('conversations.update', { conversation: editingConversation.id }), payload)
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

    const handleChangeConversationStatus = async (conversationId: number, status: ConversationStatus) => {
        const conversation = conversations.find((item) => item.id === conversationId);

        if (!conversation || conversation.status === status) {
            return;
        }

        setFeedbackMessage(null);

        try {
            await putJson<StoreConversationResponse>(route('conversations.update', { conversation: conversation.id }), {
                status,
            });

            setConversations((previous) => previous.map((item) => (item.id === conversationId ? { ...item, status } : item)));
            setFeedbackMessage(`Conversacion ${conversation.code} marcada como ${status === 'production' ? 'produccion' : 'desarrollo'}.`);
        } catch (error) {
            const errorPayload = error as {
                errors?: Record<string, string[]>;
                message?: string;
            };
            const firstError = errorPayload?.errors && Object.values(errorPayload.errors)[0] && Object.values(errorPayload.errors)[0][0];

            setFeedbackMessage(firstError ?? errorPayload?.message ?? 'No se pudo actualizar el estado de la conversacion.');
        }
    };

    const tabItems = useMemo(
        () =>
            [
                { key: 'whatsapp' as const, label: 'WhatsApp', accent: 'bg-emerald-600' },
                ...(hasRegisteredMobileDesign
                    ? [
                          { key: 'llamada' as const, label: 'Llamada', accent: 'bg-sky-600' },
                          { key: 'sms' as const, label: 'SMS', accent: 'bg-indigo-600' },
                      ]
                    : []),
            ] as const,
        [hasRegisteredMobileDesign],
    );

    const conversationVariables = useMemo(() => buildConversationVariables(), []);

    return (
        <div className="h-screen w-full bg-slate-50">
            <div className="h-full min-h-0 w-full overflow-hidden">
                <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-8">
                    <PreviewPanel
                        activeDesign={activeDesign}
                        saved={saved}
                        whatsappPreviewMode={whatsappPreviewMode}
                        mobileDesignKey={activeMobileDesignKey}
                        whatsappDesktopScale={whatsappDesktopScale}
                        themeMode={previewThemeMode}
                        canRegisterMobileDesign={
                            activeDesign === 'whatsapp' &&
                            whatsappPreviewMode === 'mobile' &&
                            lastGeneratedFromConversationCode &&
                            !isTestMobileDesignGloballyRegistered
                        }
                        isRegisteringMobileDesign={isRegisteringMobileDesign}
                        mobileDesignLabel={activeMobileDesignKey.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                        onRegisterMobileDesign={handleRegisterMobileDesign}
                    />
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
                        conversationCodeInput={conversationCodeInput}
                        onConversationCodeInputChange={setConversationCodeInput}
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
                initialStatus={editingConversation?.status ?? 'development'}
                variables={conversationVariables}
            />

            <ConversationsListModal
                open={isConversationsListModalOpen}
                onOpenChange={setIsConversationsListModalOpen}
                conversations={conversations.map((conversation) => ({
                    id: conversation.id,
                    code: conversation.code,
                    messagesCount: conversation.messages.length,
                    status: conversation.status,
                }))}
                onChangeStatus={handleChangeConversationStatus}
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
