# Plan ejecutable: refactor funcional de SMS Mobile 3

## Objetivo

Refactorizar `resources/js/evidence-generator/features/preview/designs/mobile-3/sms/PreviewMobile1Sms.tsx` para que:

- use la estructura de componentes de `mobile-3/whatsapp` como guía;
- deje de contener toda la interfaz en un único archivo;
- renderice los mensajes reales recibidos en `data.generatedMessages`;
- mantenga la apariencia actual de la vista RCS/SMS en temas claro y oscuro;
- aplique la validación temporal por mensaje y usando la zona horaria de Perú;
- conserve la conexión existente con `PreviewChannels.tsx` y el marco `Mobile1PreviewFrame`.

## Estado actual verificado

### Flujo real de datos

1. `resources/js/evidence-generator/App.tsx` solicita la evidencia a `evidences.generate`.
2. La respuesta está tipada como `GenerateEvidenceResponse` y contiene `messages: GeneratedMessage[]`.
3. `App.tsx` guarda esos mensajes en `SavedData.generatedMessages`.
4. `PreviewPanel.tsx` renderiza `PreviewSMS` cuando `activeDesign === 'sms'`.
5. `PreviewChannels.tsx` selecciona el SMS de Mobile 3 cuando `mobileDesignKey === 'mobile-3'`.
6. El componente actual recibe correctamente `data` y `themeMode`, pero no consume `data.generatedMessages`.

No se necesitan rutas nuevas, cambios de Inertia, controladores, migraciones ni modificaciones al contrato del backend.

### Problemas concretos del componente SMS actual

- `PreviewMobile1Sms.tsx` tiene aproximadamente 1,300 líneas y mezcla composición, formato de fechas, iconos SVG, colores y contenido.
- Los cuatro mensajes visibles están escritos directamente en JSX.
- El contenido se reconstruye con `nombre`, `nombreAsesor` y `monto` en vez de mostrar `GeneratedMessage.lines`.
- Se buscan propiedades no tipadas (`fechaEnvio`, `sentAt`, `createdAt`, `fecha`) mediante `Record<string, unknown>` aunque el contrato real ya expone `dateKey` y `time` por mensaje.
- La validación actual usa una sola fecha para toda la conversación; no funciona correctamente cuando los mensajes abarcan más de un día.
- Se usa la hora del navegador sin fijar `America/Lima`, lo que puede cambiar el resultado cerca de medianoche.
- El componente incluye valores ficticios de respaldo para teléfono, nombres y monto.

### Patrón de referencia en Mobile 3 WhatsApp

La implementación de WhatsApp separa responsabilidades así:

- `PreviewMobile1Whatsapp.tsx`: punto de entrada y composición de alto nivel.
- `WhatsappConversation.tsx`: normalización y recorrido de mensajes.
- `whatsapp-header/`: encabezado.
- `whatsapp-bubbles/`: burbujas y metadatos de mensaje.
- `whatsapp-footer/`: barra inferior.
- `whatsappTypes.ts`: contrato local tipado.
- `whatsappAppearance.ts`: decisiones visuales reutilizables.
- archivos `index.ts`: exportaciones públicas por carpeta.

SMS debe seguir esa separación, sin copiar funcionalidades exclusivas de WhatsApp como mensajes temporales, citas, fondos con patrones o indicadores propios de ese canal.

## Contrato funcional de la vista SMS

### Fuente de datos

- El teléfono del encabezado debe salir de `data.telefono`.
- La conversación debe salir exclusivamente de `data.generatedMessages`.
- Cada elemento debe respetar:
    - `side`: alineación recibida (`in`) o enviada (`out`);
    - `lines`: contenido real de la burbuja, respetando saltos entre líneas;
    - `time`: hora generada por el backend;
    - `dateKey`: fecha `YYYY-MM-DD` generada por el backend;
    - `status`: estado individual, cuando exista;
    - `id_`: identificador DOM, cuando exista.
- Para mensajes enviados sin `status`, usar `data.previewSnapshot?.messageStatus` como respaldo determinista.
- Si `generatedMessages` no existe o está vacío, conservar el armazón visual de RCS sin inventar mensajes comerciales.
- Si `data` es `null`, mantener `EmptyState`.

### Regla visual de hora, fecha y checks

La regla se evaluará para cada mensaje, no una sola vez para toda la conversación:

1. Si `message.dateKey` corresponde al día actual en `America/Lima`:
    - mostrar solamente la hora corta, por ejemplo `4:47 p. m.`;
    - si el mensaje es enviado (`side === 'out'`), mostrar también el doble check;
    - si el mensaje es recibido, mostrar solo la hora;
    - no mostrar la fecha completa.
2. Si el mensaje pertenece a cualquier otro día, incluidos días posteriores dentro de una conversación de varios días:
    - mostrar solamente la fecha completa usando el formato visual existente, por ejemplo `miércoles, 22 jul. · 3:33 p. m.`;
    - no mostrar un segundo valor de hora;
    - no mostrar checks.
3. La comparación nunca debe depender de `new Date('YYYY-MM-DD')`, porque esa cadena se interpreta como UTC en JavaScript.
4. Para un `dateKey` ausente o inválido, usar como respaldo la fecha de `data.fechaHora`; si tampoco es válida, usar `data.fechaHoraRegistro`.
5. El candado y el texto `Enviado con 3 SIM 1` no formarán parte del metadato del mensaje: el requisito indica únicamente hora y checks para hoy, o fecha completa para otro día.

## Estructura objetivo

```text
resources/js/evidence-generator/features/preview/designs/mobile-3/sms/
├── PreviewMobile1Sms.tsx
├── SmsConversation.tsx
├── smsAppearance.ts
├── smsDateTime.ts
├── smsDateTime.test.ts
├── smsMessages.ts
├── smsMessages.test.ts
├── smsTypes.ts
├── index.ts
├── sms-bubbles/
│   ├── SmsMessageMetadata.tsx
│   ├── SmsMobileTextBubble.tsx
│   └── index.ts
├── sms-footer/
│   ├── SmsMobileInputBar.tsx
│   └── index.ts
└── sms-header/
    ├── SmsMobileHeader.tsx
    └── index.ts
```

No crear carpetas vacías ni replicar `whatsapp-background`, porque SMS usa un color sólido. Los SVG deben vivir dentro del componente al que pertenecen; solo extraer un icono si se reutiliza o si tiene lógica propia, como el doble check.

## Responsabilidad de cada archivo

### `PreviewMobile1Sms.tsx`

- Mantenerse como punto de entrada público.
- Validar `data` y renderizar `EmptyState` cuando corresponda.
- Crear las notificaciones mediante `buildMobilePreviewNotificationIds(data, 'mobile-3', 'sms')`.
- Mantener `Mobile1PreviewFrame` y pasar `themeMode`.
- Componer únicamente `SmsMobileHeader` y `SmsConversation`.
- No contener mensajes, formateadores, paletas extensas ni SVG de header/footer.

### `smsTypes.ts`

Definir tipos locales derivados de los tipos compartidos, sin duplicar el contrato:

- `SmsData = NonNullable<PreviewProps['data']>`.
- `SmsMessageStatus` derivado de `GeneratedMessage['status']`.
- `SmsConversationMessage` con `side`, `lines`, `time`, `dateKey`, `status` e `id`.
- `SmsColors` para la paleta consumida por header, conversación, burbujas y footer.

### `smsAppearance.ts`

- Mover las paletas clara y oscura actuales.
- Exponer una función pura `getSmsColors(themeMode)`.
- Mantener los valores visuales actuales; este refactor no debe rediseñar la pantalla.
- Evitar repetir condiciones `isDark` en cada componente cuando una entrada de la paleta resuelva la decisión.

### `smsDateTime.ts`

Implementar funciones puras y testeables:

- resolver el `dateKey` efectivo del mensaje;
- comparar fechas con el día actual de `America/Lima` usando las utilidades existentes de `lib/whatsapp/time.ts` cuando sean genéricas (`getPeruDateParts`, `parseDateKey`, `getDateKeyFromLocalDateTime`);
- transformar `HH:mm` a la hora corta española usada actualmente;
- construir la fecha completa sin conversiones UTC accidentales;
- devolver un modelo de presentación discriminado, por ejemplo:

```ts
type SmsMessageTimestamp = { kind: 'today'; label: string; showChecks: boolean } | { kind: 'full-date'; label: string; showChecks: false };
```

La función principal debe aceptar un `currentDate` opcional para que las pruebas no dependan del reloj real.

### `smsMessages.ts`

- Convertir `data.generatedMessages` a `SmsConversationMessage[]`.
- Mantener el orden entregado por el backend.
- Conservar `lines` sin volver a interpolar nombres, montos o datos del formulario.
- Aplicar el estado de respaldo solo a mensajes enviados.
- Resolver la fecha de respaldo con `fechaHora` y luego `fechaHoraRegistro`.
- Devolver un arreglo vacío si no hay mensajes; no crear contenido ficticio.

### `SmsMobileHeader.tsx`

- Mover íntegramente el header actual: volver, avatar, teléfono, llamada, videollamada y opciones.
- Recibir `telefono`, `themeMode` o `colors` mediante props explícitas.
- Mantener etiquetas accesibles de los botones.
- Eliminar el teléfono ficticio; usar una presentación neutral como `-` si el valor está vacío.

### `SmsConversation.tsx`

- Recibir `data`, `themeMode` y opcionalmente `currentDate` para pruebas o composición determinista.
- Obtener los mensajes normalizados desde `smsMessages.ts`.
- Mantener los avisos estáticos propios del canal: `Chat RCS con ...` y cifrado.
- Recorrer todos los mensajes reales con una key estable basada en `id_` y, como respaldo, índice más fecha/hora.
- Calcular agrupación visual con el mensaje anterior y siguiente:
    - mismo `side` y mismo `dateKey`: burbujas consecutivas del mismo grupo;
    - cambio de lado o fecha: iniciar un grupo nuevo.
- Delegar texto y metadata a `SmsMobileTextBubble`.
- Mantener el área desplazable y el footer fijo.

### `SmsMobileTextBubble.tsx`

- Renderizar recibidos a la izquierda y enviados a la derecha.
- Aplicar las esquinas del primer/último elemento del grupo, conservando el aspecto actual.
- Renderizar cada elemento de `lines` y respetar los saltos sin concatenar contenido.
- Exponer `id={message.id}` para mantener marcadores como `ultimo_mensaje`.
- Delegar la regla temporal a `SmsMessageMetadata`.

### `SmsMessageMetadata.tsx`

- Consumir el resultado de `smsDateTime.ts`.
- Renderizar hora y doble check únicamente cuando corresponda al día actual.
- Renderizar fecha completa sin checks para cualquier otro día.
- Mantener `DoubleCheckIcon` dentro de este módulo.
- Diferenciar visualmente `read` y `delivered` si el diseño actual ya dispone de ambos colores; no inventar aleatoriedad.

### `SmsMobileInputBar.tsx`

- Mover el composer actual completo: agregar, texto `Mensaje RCS`, emoji, galería y audio.
- Mantener clases, tamaños, colores y etiquetas accesibles.
- No incorporar estado de formulario: sigue siendo una previsualización, no un chat editable.

### Archivos `index.ts`

- Exportar solo los componentes públicos de cada subcarpeta.
- Mantener `sms/index.ts` exportando `PreviewMobile1Sms` para no cambiar `mobile-3/index.ts` ni `PreviewChannels.tsx`.

## Fases de ejecución

### Fase 1: asegurar el comportamiento con pruebas puras

- [ ] Crear `smsDateTime.test.ts` antes de mover JSX.
- [ ] Probar mensaje de hoy en Lima: hora corta y `showChecks: true` para `out`.
- [ ] Probar mensaje recibido de hoy: hora corta y sin checks.
- [ ] Probar mensaje de otro día: fecha completa y sin checks.
- [ ] Probar cambio de día cerca de medianoche UTC/Lima.
- [ ] Probar `dateKey` inválido y la prioridad de `fechaHora` sobre `fechaHoraRegistro`.
- [ ] Crear `smsMessages.test.ts`.
- [ ] Probar que se preservan orden, lado, líneas, estado, fecha e identificador.
- [ ] Probar el estado de respaldo para mensajes enviados.
- [ ] Probar que los mensajes recibidos no reciben estado de envío.
- [ ] Probar que una entrada sin `generatedMessages` produce `[]`.

### Fase 2: extraer lógica sin cambiar la vista

- [ ] Crear `smsTypes.ts`.
- [ ] Crear `smsAppearance.ts` con la paleta actual.
- [ ] Crear `smsDateTime.ts` y hacer pasar sus pruebas.
- [ ] Crear `smsMessages.ts` y hacer pasar sus pruebas.
- [ ] Eliminar el cast a `Record<string, unknown>` y las propiedades de fecha inventadas.

### Fase 3: dividir componentes visuales

- [ ] Extraer `SmsMobileHeader` y su barrel export.
- [ ] Extraer `SmsMobileInputBar` y su barrel export.
- [ ] Extraer `SmsMessageMetadata` con el doble check.
- [ ] Extraer `SmsMobileTextBubble`.
- [ ] Crear `SmsConversation` y conectar el recorrido de mensajes reales.
- [ ] Reducir `PreviewMobile1Sms.tsx` al rol de orquestador.
- [ ] Mantener sin cambios la conexión pública de `sms/index.ts`.

### Fase 4: eliminar contenido ficticio

- [ ] Eliminar los mensajes escritos directamente en JSX.
- [ ] Eliminar los valores ficticios de teléfono, cliente, asesor y monto.
- [ ] Confirmar que nombres, montos, DNI u otros datos solo aparecen cuando están presentes dentro de `GeneratedMessage.lines` generado por el backend.
- [ ] Confirmar que una conversación con mensajes `in` y `out` usa ambos estilos visuales.
- [ ] Confirmar que conversaciones de varios días evalúan cada mensaje por separado.

### Fase 5: verificación automática

Ejecutar desde `D:\evidencias`:

```powershell
node --test --experimental-strip-types resources/js/evidence-generator/features/preview/designs/mobile-3/sms/smsDateTime.test.ts resources/js/evidence-generator/features/preview/designs/mobile-3/sms/smsMessages.test.ts
node --test --experimental-strip-types resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts
npx tsc --noEmit
npx eslint resources/js/evidence-generator/features/preview/designs/mobile-3/sms --fix
npx prettier --write resources/js/evidence-generator/features/preview/designs/mobile-3/sms
npm run build
php artisan test --compact tests/Feature/EvidenceGenerationTest.php
git diff --check
```

Después de ejecutar ESLint y Prettier, volver a correr las dos pruebas Node, `npx tsc --noEmit` y `npm run build` para verificar el estado final formateado.

### Fase 6: validación visual manual

Validar como mínimo esta matriz en la pestaña SMS con Mobile 3:

| Tema   | Mensajes        | Fecha          | Resultado esperado                            |
| ------ | --------------- | -------------- | --------------------------------------------- |
| Claro  | `in` y `out`    | Hoy en Lima    | Hora en todos; doble check solo en enviados   |
| Oscuro | `in` y `out`    | Hoy en Lima    | Mismo comportamiento y contraste legible      |
| Claro  | `in` y `out`    | Otro día       | Fecha completa; sin checks                    |
| Oscuro | Varios mensajes | Dos o más días | Cada mensaje usa su propia fecha y agrupación |
| Ambos  | Sin mensajes    | N/A            | Armazón RCS sin burbujas inventadas           |

También comprobar:

- scroll con conversaciones largas;
- footer siempre visible;
- teléfono real en el header y aviso RCS;
- saltos de línea de `GeneratedMessage.lines`;
- marcador DOM `id_` cuando exista;
- ausencia de errores en consola;
- ausencia de regresiones en WhatsApp, llamadas y otros diseños móviles.

## Criterios de aceptación

- [ ] `PreviewMobile1Sms.tsx` actúa únicamente como orquestador y queda sustancialmente reducido.
- [ ] La estructura SMS refleja el patrón header/conversation/bubbles/footer/types/appearance de WhatsApp.
- [ ] No hay mensajes comerciales ni datos personales escritos directamente en la vista.
- [ ] La vista consume `data.generatedMessages` sin cambiar el backend.
- [ ] Cada mensaje respeta `side`, `lines`, `time`, `dateKey`, `status` e `id_`.
- [ ] Un mensaje del día actual en Lima muestra hora y checks únicamente cuando es enviado.
- [ ] Un mensaje de cualquier otro día muestra solo la fecha completa y nunca checks.
- [ ] Los cálculos son deterministas en pruebas y seguros frente a diferencias UTC/Lima.
- [ ] Los temas claro y oscuro mantienen la apariencia actual.
- [ ] No se modifica el comportamiento de Mobile 1, Mobile 2, WhatsApp ni llamadas.
- [ ] Las pruebas Node, TypeScript, ESLint, Prettier, build de Vite y prueba feature indicada finalizan correctamente.

## Fuera de alcance

- Rediseñar la vista SMS/RCS.
- Hacer interactivos los botones del header o composer.
- Cambiar cómo el backend genera las conversaciones.
- Modificar modelos, migraciones, rutas o controladores.
- Compartir componentes entre Mobile 1, Mobile 2 y Mobile 3 en esta iteración.
- Cambiar dependencias o incorporar una nueva biblioteca de fechas.

## Definición de terminado

El trabajo estará terminado cuando la pestaña SMS de Mobile 3 muestre exclusivamente la conversación real generada por la API, el componente monolítico esté dividido según la estructura definida, la regla hora/fecha/checks se cumpla por mensaje en hora de Perú y todas las verificaciones automáticas y visuales anteriores hayan sido completadas.
