import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { getJson, postFormData, postJson, putJson } from './lib/api';
import { createInitialFormState } from './lib/formState';
import { resolveActiveMobileDesignKey } from './lib/mobileDesignSelection';
import { hydrateReplayForm, isReplayGenerateBlocked, shouldApplyReplayLookupResult } from './lib/replayForm';
import { applyConversationTestDefaults } from './lib/testingDefaults';
import type {
    ActiveDesign,
    ConversationProgressSummary,
    ConversationStatus,
    FormInputKey,
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
    visualSeed: string;
    visualSeedHash: string;
    visualSeedVersion: string;
    messages: GeneratedMessage[];
    previewSnapshot: SavedData['previewSnapshot'];
    progress: ConversationProgressSummary;
    trayProfile: WindowsTrayProfile;
}

interface ReplayEvidenceResponse {
    seedCode: string;
    conversationId: number;
    generatedAt: string | null;
    inputData: Partial<Record<FormInputKey, string>>;
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

function revokePreviewImage(form: FormState): void {
    if (form.img_64.startsWith('blob:')) {
        URL.revokeObjectURL(form.img_64);
    }
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
    const [testWhatsappPreviewMode, setTestWhatsappPreviewMode] = useState<PreviewDeviceMode>('desktop');
    const [testPreviewThemeMode, setTestPreviewThemeMode] = useState<PreviewThemeMode>('light');
    const [form, setForm] = useState<FormState>(() => createInitialFormState());
    const [imageFileInputKey, setImageFileInputKey] = useState(0);

    const [saved, setSaved] = useState<SavedData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isReplayLookupPending, setIsReplayLookupPending] = useState(false);
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
    const replayLookupSeedRef = useRef('');

    const hasRegisteredMobileDesign = registeredMobileDesigns.length > 0;
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
    const isTestingPreview = isTestingConversation || lastGeneratedFromConversationCode;
    const whatsappPreviewMode: PreviewDeviceMode = isTestingPreview
        ? testWhatsappPreviewMode
        : hasRegisteredMobileDesign
          ? evidenceDeviceMode
          : 'desktop';
    const previewThemeMode = isTestingPreview ? testPreviewThemeMode : evidenceThemeMode;
    const activeMobileDesignKey = shouldUseTestMobileDesign ? testMobileDesignKey : userMobileDesignKey;
    const isTestMobileDesignGloballyRegistered = globalMobileDesignKeys.includes(testMobileDesignKey);
    const isGenerateDisabled = isReplayGenerateBlocked({
        isGenerating,
        isReplayLookupPending,
        seedCodeInput,
    });

    const handleChange = (key: FormInputKey) => (e: ChangeEvent<HTMLInputElement>) => {
        const value =
            key === 'dniCliente'
                ? e.target.value.replace(/\D/g, '').slice(0, 8)
                : key === 'telefono'
                  ? e.target.value.replace(/\D/g, '').slice(0, 9)
                  : key === 'duracion'
                    ? e.target.value.replace(/\D/g, '')
                    : e.target.value;

        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files?.[0] ?? null;

        setForm((previous) => {
            if (previous.img_64.startsWith('blob:')) {
                URL.revokeObjectURL(previous.img_64);
            }

            return {
                ...previous,
                img_64: imageFile ? URL.createObjectURL(imageFile) : '',
                img_64_file: imageFile,
            };
        });
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
        const trimmedSeedCode = seedCodeInput.trim();
        replayLookupSeedRef.current = trimmedSeedCode;

        if (trimmedSeedCode === '') {
            setIsReplayLookupPending(false);
            setForm((previous) => {
                revokePreviewImage(previous);

                return createInitialFormState();
            });
            setImageFileInputKey((previous) => previous + 1);
            setGeneratedSeedCode('');

            return;
        }

        setIsReplayLookupPending(true);
        setGeneratedSeedCode(trimmedSeedCode);

        const timeoutId = window.setTimeout(() => {
            void (async () => {
                try {
                    const response = await getJson<ReplayEvidenceResponse>(route('evidences.show-by-seed', { seedCode: trimmedSeedCode }));

                    if (!shouldApplyReplayLookupResult(replayLookupSeedRef.current, trimmedSeedCode)) {
                        return;
                    }

                    setForm((previous) => {
                        revokePreviewImage(previous);

                        return hydrateReplayForm(previous, response.inputData);
                    });
                    setGeneratedSeedCode(response.seedCode);
                    setImageFileInputKey((previous) => previous + 1);
                    setFeedbackMessage(null);
                } catch (error) {
                    if (!shouldApplyReplayLookupResult(replayLookupSeedRef.current, trimmedSeedCode)) {
                        return;
                    }

                    const errorPayload = error as {
                        message?: string;
                    };

                    setFeedbackMessage(errorPayload.message ?? 'No se pudo cargar la evidencia guardada para esa sal.');
                } finally {
                    if (shouldApplyReplayLookupResult(replayLookupSeedRef.current, trimmedSeedCode)) {
                        setIsReplayLookupPending(false);
                    }
                }
            })();
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [seedCodeInput]);

    useEffect(() => {
        if (conversationCodeInput.trim() === '' || seedCodeInput.trim() !== '') {
            return;
        }

        setForm((previous) => applyConversationTestDefaults(previous));
    }, [conversationCodeInput, seedCodeInput]);

    const handleGenerate = async () => {
        if (isGenerateDisabled) {
            return;
        }

        setIsGenerating(true);
        setFeedbackMessage(null);
        const isReplayGeneration = seedCodeInput.trim() !== '';
        const shouldUseConversationDefaults = seedCodeInput.trim() === '' && conversationCodeInput.trim() !== '';
        const requestForm = shouldUseConversationDefaults ? applyConversationTestDefaults(form) : form;

        try {
            const payload = new FormData();
            const requestData = {
                ...requestForm,
                ...(seedCodeInput.trim() !== '' ? { seedCode: seedCodeInput.trim() } : {}),
                ...(seedCodeInput.trim() === '' && conversationCodeInput.trim() !== '' ? { conversationCode: conversationCodeInput.trim() } : {}),
            };

            Object.entries(requestData).forEach(([key, value]) => {
                if (key === 'img_64_file') {
                    return;
                }

                if (key === 'img_64') {
                    if (requestForm.img_64_file) {
                        payload.append('img_64', requestForm.img_64_file);
                    }

                    return;
                }

                payload.append(key, String(value ?? ''));
            });

            const response = await postFormData<GenerateEvidenceResponse>(route('evidences.generate'), payload);

            setLastGeneratedFromConversationCode(shouldUseConversationDefaults);
            setSaved({
                ...requestForm,
                nombreAsesor: resolvedCurrentUser.name,
                dni: resolvedCurrentUser.dni,
                sexualidadAsesor: resolvedCurrentUser.sexualidad,
                modoEntrada: requestForm.modoEntrada,
                tipoCliente: pickRandomClientProfile(),
                conversationId: response.conversationId,
                seedCode: response.seedCode,
                visualSeed: response.visualSeed,
                visualSeedHash: response.visualSeedHash,
                visualSeedVersion: response.visualSeedVersion,
                generatedMessages: response.messages,
                previewSnapshot: response.previewSnapshot,
                progress: response.progress,
                trayProfile: response.trayProfile,
            });
            setGeneratedSeedCode(response.seedCode);
            setProgress(response.progress);
            setFeedbackMessage(`Conversacion usada: ${response.conversationId}`);
            if (!isReplayGeneration) {
                setForm(createInitialFormState());
                setImageFileInputKey((previous) => previous + 1);
            }
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
                        showTestingPreviewControls={isTestingPreview}
                        whatsappPreviewMode={testWhatsappPreviewMode}
                        themeMode={testPreviewThemeMode}
                        onWhatsappPreviewModeChange={setTestWhatsappPreviewMode}
                        onThemeModeChange={setTestPreviewThemeMode}
                        onChange={handleChange}
                        onImageFileChange={handleImageFileChange}
                        imageFileInputKey={imageFileInputKey}
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
                        isReplayLookupPending={isReplayLookupPending}
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
