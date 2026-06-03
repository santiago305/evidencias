export interface ConversationVariable {
    key: string;
    placeholder: string;
}

export function buildConversationVariables(): ConversationVariable[] {
    return [
        {
            key: 'saludo',
            placeholder: '{saludo}',
        },
        {
            key: 'nombre_cliente',
            placeholder: '{nombre_cliente}',
        },
        {
            key: 'primer_nombre_cliente',
            placeholder: '{primer_nombre_cliente}',
        },
        {
            key: 'nombre_asesor',
            placeholder: '{nombre_asesor}',
        },
        {
            key: 'primer_nombre_asesor',
            placeholder: '{primer_nombre_asesor}',
        },
        {
            key: 'telefono',
            placeholder: '{telefono}',
        },
        {
            key: 'monto',
            placeholder: '{monto}',
        },
        {
            key: 'tasa',
            placeholder: '{tasa}',
        },
        {
            key: 'cuota',
            placeholder: '{cuota}',
        },
        {
            key: 'plazo',
            placeholder: '{plazo}',
        },
    ];
}
