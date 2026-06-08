import type { ChangeEvent } from 'react';
import { Monitor, Moon, Smartphone, Sun } from 'lucide-react';
import type { ActiveDesign, ConversationProgressSummary, FormState, PreviewDeviceMode, PreviewThemeMode, SavedData } from '../../../types';
import { DataForm } from './DataForm';
import { DesignTabs } from './DesignTabs';

interface TabItem {
    key: ActiveDesign;
    label: string;
    accent: string;
}

interface FormPanelProps {
    activeDesign: ActiveDesign;
    whatsappPreviewMode: PreviewDeviceMode;
    themeMode: PreviewThemeMode;
    form: FormState;
    saved: SavedData | null;
    tabItems: readonly TabItem[];
    canPreviewMobileDesign: boolean;
    onSelectDesign: (design: ActiveDesign) => void;
    onWhatsappPreviewModeChange: (mode: PreviewDeviceMode) => void;
    onThemeModeChange: (mode: PreviewThemeMode) => void;
    onChange: (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => void;
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
    whatsappPreviewMode,
    themeMode,
    form,
    saved,
    tabItems,
    canPreviewMobileDesign,
    onSelectDesign,
    onWhatsappPreviewModeChange,
    onThemeModeChange,
    onChange,
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
        <div className="lg:col-span-2">
            <div className="h-full overflow-hidden border border-slate-200 bg-white shadow-sm">
                <DesignTabs activeDesign={activeDesign} tabItems={tabItems} onSelect={onSelectDesign} />

                <div className="grid gap-2 border-b border-slate-200 bg-slate-50 p-3">
                    {activeDesign === 'whatsapp' ? (
                        <div className={['grid gap-1 rounded-xl border border-slate-200 bg-white p-1', canPreviewMobileDesign ? 'grid-cols-2' : 'grid-cols-1'].join(' ')}>
                            {[
                                { mode: 'desktop' as const, label: 'PC', icon: Monitor },
                                ...(canPreviewMobileDesign ? [{ mode: 'mobile' as const, label: 'Celular', icon: Smartphone }] : []),
                            ].map((item) => {
                                const Icon = item.icon;
                                const active = whatsappPreviewMode === item.mode;

                                return (
                                    <button
                                        key={item.mode}
                                        type="button"
                                        onClick={() => onWhatsappPreviewModeChange(item.mode)}
                                        className={[
                                            'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition',
                                            active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
                                        ].join(' ')}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => onThemeModeChange(isDark ? 'light' : 'dark')}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                        {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
                        {isDark ? 'Modo claro' : 'Modo oscuro'}
                    </button>
                </div>

                <DataForm
                    form={form}
                    activeDesign={activeDesign}
                    saved={saved}
                    onChange={onChange}
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
