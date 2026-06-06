import type { ChangeEvent } from 'react';
import { Input } from '../../../components/ui/Input';
import type { ActiveDesign, ConversationProgressSummary, FormState, SavedData } from '../../../types';

interface DataFormProps {
    form: FormState;
    activeDesign: ActiveDesign;
    saved: SavedData | null;
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

// Componente que renderiza el formulario y el estado de guardado.
export function DataForm({
    form,
    onChange,
    onGenerate,
    isGenerating,
    generatedSeedCode,
    seedCodeInput,
    onSeedCodeInputChange,
    conversationCodeInput,
    onConversationCodeInputChange,
    conversationsCount,
    onOpenConversationModal,
    onOpenConversationsListModal,
    feedbackMessage,
}: DataFormProps) {
    return (
        <div className="grid grid-cols-1 gap-2 p-3">
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={onOpenConversationModal}
                    className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                    Nueva conversación
                </button>

                <button
                    type="button"
                    onClick={onOpenConversationsListModal}
                    className="inline-flex cursor-pointer items-center justify-center rounded-sm border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                    Ver conversaciones
                </button>

                <div className="col-span-2 text-center text-[10px] text-slate-500">
                    Conversaciones registradas: <b>{conversationsCount}</b>
                </div>
            </div>

            <Input label="Telefono" id="telefono" value={form.telefono} onChange={onChange('telefono')} placeholder="Ej: 999 999 999" />

            <Input label="Nombre" id="nombre-cliente" value={form.nombre} onChange={onChange('nombre')} placeholder="Ej: Juan Pérez" />

            <Input
                label="DNI cliente"
                id="DNI_CLIENTE"
                value={form.dniCliente}
                onChange={onChange('dniCliente')}
                placeholder="Ej: 12345678"
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]{8}"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input label="Monto" id="monto" value={form.monto} onChange={onChange('monto')} placeholder="Ej: 1500" />

                <Input label="Tasa" id="tasa" value={form.tasa} onChange={onChange('tasa')} placeholder="Ej: 2.5%" />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input label="Cuota" id="cuota" value={form.cuota} onChange={onChange('cuota')} placeholder="Ej: 250" />

                <Input label="Plazo" id="plazo" value={form.plazo} onChange={onChange('plazo')} placeholder="Ej: 12 meses" />
            </div>

            <Input label="Fecha y hora" id="fecha-hora" type="datetime-local" value={form.fechaHora} onChange={onChange('fechaHora')} />

            <Input
                label="Fecha y hora de registro"
                id="fecha-hora-registro"
                type="datetime-local"
                value={form.fechaHoraRegistro}
                onChange={onChange('fechaHoraRegistro')}
            />
            <Input label="Duracion (min)" id="duracion" value={form.duracion} onChange={onChange('duracion')} placeholder="Ej: 6" />

            <Input
                label="ID de sal generada"
                id="generated-seed-id"
                value={generatedSeedCode}
                onChange={() => {}}
                placeholder="Se muestra al generar"
                readOnly
            />

            <Input
                label="Completar por sal"
                id="seed-input"
                value={seedCodeInput}
                onChange={(e) => onSeedCodeInputChange(e.target.value)}
                placeholder="Ej: EVC2-C020-U01-R03-AB12CD34-Z9Q7K3A1B2"
            />

            <Input
                label="Código de la conversación"
                id="conversation-code-input"
                value={conversationCodeInput}
                onChange={(e) => onConversationCodeInputChange(e.target.value)}
                placeholder="Ej: conv_20260605123000_ab12"
                hint="Sirve para probar una conversación específica"
            />

            <button
                type="button"
                id="generate-evidence-btn"
                onClick={onGenerate}
                disabled={isGenerating}
                className={[
                    'mt-1 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold',
                    'bg-slate-900 text-white shadow-sm transition-all',
                    'hover:-translate-y-px hover:shadow-md active:translate-y-0',
                    'cursor-pointer focus:ring-2 focus:ring-slate-900/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                ].join(' ')}
            >
                {isGenerating ? 'Generando...' : 'Generar evidencia'}
            </button>

            {feedbackMessage ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">{feedbackMessage}</div>
            ) : null}
        </div>
    );
}
