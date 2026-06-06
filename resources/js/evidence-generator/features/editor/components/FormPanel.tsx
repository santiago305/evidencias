import type { ChangeEvent } from 'react';
import type { ActiveDesign, ConversationProgressSummary, FormState, SavedData } from '../../../types';
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
    form,
    saved,
    tabItems,
    onSelectDesign,
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
    return (
        <div className="lg:col-span-2">
            <div className="h-full overflow-hidden border border-slate-200 bg-white shadow-sm">
                <DesignTabs activeDesign={activeDesign} tabItems={tabItems} onSelect={onSelectDesign} />

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
