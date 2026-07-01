import type { FormInputKey, FormState, ModoEntrada } from '../types.ts';

const replayHydratedFields = [
    'telefono',
    'nombre',
    'dniCliente',
    'monto',
    'tasa',
    'cuota',
    'plazo',
    'TCEA',
    'fechaHora',
    'fechaHoraRegistro',
    'duracion',
    'modoEntrada',
    'img_64',
] as const satisfies ReadonlyArray<FormInputKey>;

type ReplayInputData = Partial<Record<FormInputKey, string>>;

interface GenerateEvidenceActionState {
    isGenerating: boolean;
    isReplayLookupPending: boolean;
    seedCodeInput: string;
}

function isModoEntrada(value: string): value is ModoEntrada {
    return value === 'informativo' || value === 'contactado';
}

export function clearReplayHydratedForm(previousForm: FormState): FormState {
    return {
        ...previousForm,
        telefono: '',
        nombre: '',
        dniCliente: '',
        monto: '',
        tasa: '',
        cuota: '',
        plazo: '',
        TCEA: '',
        fechaHora: '',
        fechaHoraRegistro: '',
        duracion: '',
        img_64: '',
        img_64_file: null,
        modoEntrada: 'informativo',
    };
}

export function hydrateReplayForm(previousForm: FormState, inputData: ReplayInputData): FormState {
    const nextForm = clearReplayHydratedForm(previousForm);

    for (const field of replayHydratedFields) {
        const value = inputData[field];

        if (typeof value !== 'string') {
            continue;
        }

        if (field === 'modoEntrada') {
            nextForm.modoEntrada = isModoEntrada(value) ? value : 'informativo';
            continue;
        }

        nextForm[field] = value;
    }

    return nextForm;
}

export function shouldApplyReplayLookupResult(currentSeedCodeInput: string, requestedSeedCode: string): boolean {
    const normalizedCurrentSeedCode = currentSeedCodeInput.trim();
    const normalizedRequestedSeedCode = requestedSeedCode.trim();

    return normalizedCurrentSeedCode !== '' && normalizedCurrentSeedCode === normalizedRequestedSeedCode;
}

export function isReplayGenerateBlocked({
    isGenerating,
    isReplayLookupPending,
    seedCodeInput,
}: GenerateEvidenceActionState): boolean {
    return isGenerating || (seedCodeInput.trim() !== '' && isReplayLookupPending);
}

export function getGenerateEvidenceActionLabel({
    isGenerating,
    isReplayLookupPending,
    seedCodeInput,
}: GenerateEvidenceActionState): string {
    if (isGenerating) {
        return seedCodeInput.trim() !== '' ? 'Regenerando...' : 'Generando...';
    }

    if (seedCodeInput.trim() !== '' && isReplayLookupPending) {
        return 'Cargando evidencia...';
    }

    return seedCodeInput.trim() !== '' ? 'Regenerar evidencia' : 'Generar evidencia';
}
