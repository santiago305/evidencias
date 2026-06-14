import type { ChangeEvent } from 'react';
import { Monitor, Moon, Smartphone, Sun } from 'lucide-react';
import type {
    ActiveDesign,
    ConversationProgressSummary,
    FormInputKey,
    FormState,
    PreviewDeviceMode,
    PreviewThemeMode,
    SavedData,
} from '../../../types';
import { DataForm } from './DataForm';
import { DesignTabs } from './DesignTabs';

interface TabItem {
    key: ActiveDesign;
    label: string;
    accent: string;
}

interface FormPanelProps {
    activeDesign: ActiveDesign;
    form: FormState;
    saved: SavedData | null;
    tabItems: readonly TabItem[];
    onSelectDesign: (design: ActiveDesign) => void;
    showTestingPreviewControls: boolean;
    whatsappPreviewMode: PreviewDeviceMode;
    themeMode: PreviewThemeMode;
    onWhatsappPreviewModeChange: (mode: PreviewDeviceMode) => void;
    onThemeModeChange: (mode: PreviewThemeMode) => void;
    onChange: (key: FormInputKey) => (e: ChangeEvent<HTMLInputElement>) => void;
    onImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    imageFileInputKey: number;
    onGenerate: () => void;
    isGenerating: boolean;
    generatedSeedCode: string;
    seedCodeInput: string;
    onSeedCodeInputChange: (value: string) => void;
    conversationCodeInput: string;
    onConversationCodeInputChange: (value: string) => void;
    progress: ConversationProgressSummary | null;
    conversationsCount: number;
    onOpenConversationModal: () => void;
    onOpenConversationsListModal: () => void;
    feedbackMessage: string | null;
}

// Componente que arma la tarjeta del formulario con tabs y campos.
export function FormPanel({
    activeDesign,
    form,
    saved,
    tabItems,
    onSelectDesign,
    showTestingPreviewControls,
    whatsappPreviewMode,
    themeMode,
    onWhatsappPreviewModeChange,
    onThemeModeChange,
    onChange,
    onImageFileChange,
    imageFileInputKey,
    onGenerate,
    isGenerating,
    generatedSeedCode,
    seedCodeInput,
    onSeedCodeInputChange,
    conversationCodeInput,
    onConversationCodeInputChange,
    progress,
    conversationsCount,
    onOpenConversationModal,
    onOpenConversationsListModal,
    feedbackMessage,
}: FormPanelProps) {
    const isDark = themeMode === 'dark';

    return (
        <div className="min-h-0 lg:col-span-2">
            <div className="flex h-full min-h-0 flex-col overflow-hidden border border-slate-200 bg-white shadow-sm">
                <DesignTabs activeDesign={activeDesign} tabItems={tabItems} onSelect={onSelectDesign} />

                {showTestingPreviewControls && activeDesign === 'whatsapp' ? (
                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 bg-slate-50 p-2">
                        <div className="col-span-2 grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                            {[
                                { mode: 'desktop' as const, label: 'PC', icon: Monitor },
                                { mode: 'mobile' as const, label: 'Celular', icon: Smartphone },
                            ].map((item) => {
                                const Icon = item.icon;
                                const active = whatsappPreviewMode === item.mode;

                                return (
                                    <button
                                        key={item.mode}
                                        type="button"
                                        onClick={() => onWhatsappPreviewModeChange(item.mode)}
                                        className={[
                                            'inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-[11px] font-semibold transition',
                                            active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
                                        ].join(' ')}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() => onThemeModeChange(isDark ? 'light' : 'dark')}
                            className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                        >
                            {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
                            {isDark ? 'Modo claro' : 'Modo oscuro'}
                        </button>
                    </div>
                ) : null}

                <DataForm
                    form={form}
                    activeDesign={activeDesign}
                    saved={saved}
                    onChange={onChange}
                    onImageFileChange={onImageFileChange}
                    imageFileInputKey={imageFileInputKey}
                    onGenerate={onGenerate}
                    isGenerating={isGenerating}
                    generatedSeedCode={generatedSeedCode}
                    seedCodeInput={seedCodeInput}
                    onSeedCodeInputChange={onSeedCodeInputChange}
                    conversationCodeInput={conversationCodeInput}
                    onConversationCodeInputChange={onConversationCodeInputChange}
                    progress={progress}
                    conversationsCount={conversationsCount}
                    onOpenConversationModal={onOpenConversationModal}
                    onOpenConversationsListModal={onOpenConversationsListModal}
                    feedbackMessage={feedbackMessage}
                />
            </div>
        </div>
    );
}
