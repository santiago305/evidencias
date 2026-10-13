import type { ChangeEvent } from 'react';
import { Input } from '../../../components/ui/Input';
import type { DecimalFormField } from '../../../lib/formInputFormatting';
import { getGenerateEvidenceActionLabel, isReplayGenerateBlocked } from '../../../lib/replayForm';
import type { ActiveDesign, ConversationProgressSummary, FormInputKey, FormState, SavedData } from '../../../types';

interface DataFormProps {
    form: FormState;
    activeDesign: ActiveDesign;
    saved: SavedData | null;
    onChange: (key: FormInputKey) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onDecimalBlur: (field: DecimalFormField) => void;
    onImageFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    imageFileInputKey: number;
    onGenerate: () => void;
    isGenerating: boolean;
    isReplayLookupPending: boolean;
    generatedSeedCode: string;
    seedCodeInput: string;
    onSeedCodeInputChange: (value: string) => void;
    conversationCodeInput: string;
    onConversationCodeInputChange: (value: string) => void;
    progress: ConversationProgressSummary | null;
    numericValidationMessage: string | null;
    feedbackMessage: string | null;
}

// Componente que renderiza el formulario y el estado de guardado.
export function DataForm({
    form,
    onChange,
    onDecimalBlur,
    onImageFileChange,
    imageFileInputKey,
    onGenerate,
    isGenerating,
    isReplayLookupPending,
    generatedSeedCode,
    seedCodeInput,
    onSeedCodeInputChange,
    conversationCodeInput,
    onConversationCodeInputChange,
    feedbackMessage,
    numericValidationMessage,
}: DataFormProps) {
    const isGenerateDisabled =
        isReplayGenerateBlocked({
            isGenerating,
            isReplayLookupPending,
            seedCodeInput,
        }) || numericValidationMessage !== null;
    const generateButtonLabel = getGenerateEvidenceActionLabel({
        isGenerating,
        isReplayLookupPending,
        seedCodeInput,
    });

    return (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-y-auto p-3">
            <Input
                label="Telefono"
                id="telefono"
                value={form.telefono}
                onChange={onChange('telefono')}
                placeholder="Ej: 999999999"
                maxLength={9}
                inputMode="numeric"
                pattern="9[0-9]{8}"
            />

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
                <label className="block">
                    <span className="text-xs font-semibold text-slate-700">
                        Sexo <span className="font-normal text-slate-500">(opcional)</span>
                    </span>
                    <select
                        id="sexo"
                        value={form.sexo}
                        onChange={onChange('sexo')}
                        className="mt-1 w-full rounded-sm border border-slate-200 bg-white p-2 text-xs text-slate-900 shadow-sm focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
                    >
                        <option value="">Sin seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </label>
                <div className="mt-[5px]">
                    <Input
                        label="Fecha de nacimiento (opcional)"
                        id="fecha_nacimiento"
                        type="date"
                        value={form.fecha_nacimiento}
                        onChange={onChange('fecha_nacimiento')}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                    type="text"
                    label="Monto"
                    id="monto"
                    value={form.monto}
                    onChange={onChange('monto')}
                    onBlur={() => onDecimalBlur('monto')}
                    placeholder="Ej: 1500.50"
                    maxLength={8}
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]{1,2})?"
                    hint="Máximo 99999.00"
                />

                <Input
                    label="Tasa (%)"
                    id="tasa"
                    value={form.tasa}
                    onChange={onChange('tasa')}
                    onBlur={() => onDecimalBlur('tasa')}
                    placeholder="Ej: 2.50"
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]{1,2})?%?"
                    hint="Máximo 2 decimales"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                    label="Cuota"
                    id="cuota"
                    value={form.cuota}
                    onChange={onChange('cuota')}
                    onBlur={() => onDecimalBlur('cuota')}
                    placeholder="Ej: 250.00"
                    maxLength={8}
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]{1,2})?"
                    hint="Máximo 99999.00"
                />

                <Input
                    label="TCEA (%)"
                    id="TCEA"
                    value={form.TCEA}
                    onChange={onChange('TCEA')}
                    onBlur={() => onDecimalBlur('TCEA')}
                    placeholder="Ej: 45.20"
                    inputMode="decimal"
                    pattern="[0-9]+([.,][0-9]{1,2})?%?"
                    hint="Máximo 2 decimales"
                />
            </div>

            <Input
                label="Plazo"
                id="plazo"
                type="number"
                value={form.plazo}
                onChange={onChange('plazo')}
                placeholder="Ej: 12"
                inputMode="numeric"
                pattern="[0-9]+"
                hint="Solo números enteros"
            />

            {numericValidationMessage ? (
                <p className="text-xs font-medium text-rose-700" role="alert">
                    {numericValidationMessage}
                </p>
            ) : null}

            <Input label="Fecha y hora" id="fecha-hora" type="datetime-local" value={form.fechaHora} onChange={onChange('fechaHora')} />

            <Input
                label="Fecha y hora de registro"
                id="fecha-hora-registro"
                type="datetime-local"
                value={form.fechaHoraRegistro}
                onChange={onChange('fechaHoraRegistro')}
            />
            <Input
                label="Duracion (min)"
                id="duracion"
                type="number"
                value={form.duracion}
                onChange={onChange('duracion')}
                placeholder="Ej: 6"
                inputMode="numeric"
            />

            <div className="space-y-1">
                <label htmlFor="img_64" className="block text-xs font-semibold text-slate-700">
                    Imagen PNG
                </label>
                <input
                    key={imageFileInputKey}
                    id="img_64"
                    type="file"
                    accept="image/png,.png"
                    onChange={onImageFileChange}
                    className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:bg-slate-50 focus:border-slate-500 focus:ring-2 focus:ring-slate-900/10 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">Opcional. El archivo debe llamarse {form.dniCliente || 'DNI'}.png, salvo en modo prueba.</p>
            </div>

            <Input
                label="ID de sal generada"
                id="generated-seed-id"
                value={generatedSeedCode}
                onChange={() => {}}
                placeholder="Se muestra al generar"
                readOnly
            />

            <Input
                label="Recuperar evidencia por sal"
                id="seed-input"
                value={seedCodeInput}
                onChange={(e) => onSeedCodeInputChange(e.target.value)}
                placeholder="Ej: EVC2-C020-U01-R03-AB12CD34-Z9Q7K3A1B2"
                hint="Carga una evidencia guardada"
            />

            <Input
                label="Código de la conversación"
                id="conversation-code-input"
                value={conversationCodeInput}
                onChange={(e) => onConversationCodeInputChange(e.target.value)}
                placeholder="Ej: conv_20260605123000_ab12"
                hint="Probar una conversación"
            />

            <button
                type="button"
                id="generate-evidence-btn"
                onClick={onGenerate}
                disabled={isGenerateDisabled}
                className={[
                    'mt-1 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold',
                    'bg-slate-900 text-white shadow-sm transition-all',
                    'hover:-translate-y-px hover:shadow-md active:translate-y-0',
                    'cursor-pointer focus:ring-2 focus:ring-slate-900/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                ].join(' ')}
            >
                {generateButtonLabel}
            </button>

            {feedbackMessage ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">{feedbackMessage}</div>
            ) : null}
        </div>
    );
}
