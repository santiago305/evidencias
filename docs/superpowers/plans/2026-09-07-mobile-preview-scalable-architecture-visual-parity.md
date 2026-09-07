# Arquitectura escalable de previews móviles — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar Mobile-1, Mobile-2, Mobile-3 y Mobile-4 alrededor de perfiles declarativos y renderers compartidos, eliminando duplicación de composición sin alterar un solo resultado visual ni el algoritmo de seeds/notificaciones.

**Architecture:** Aplicar una migración tipo *strangler*: congelar primero el HTML renderizado de los 24 casos activos (4 móviles × 3 canales × 2 temas), introducir un núcleo de composición y perfiles tipados, migrar el registry y retirar únicamente wrappers/aliases comprobados como redundantes. Los componentes visuales que distinguen a Mobile-1/2/3 permanecen como adaptadores congelados; Mobile-4 conserva su renderer especial. El backend filtra claves no soportadas a través de `MobileDesignCatalog` antes de enviarlas a React.

**Tech Stack:** Laravel 12, PHP 8.2-compatible, Inertia v2, React 19, TypeScript 5.7, Tailwind CSS 4, Vite 6, Node `node:test`, Pest 3.

---

## 1. Resultado esperado y límites

Al terminar, agregar un móvil nuevo debe consistir en:

1. añadir su clave al tipo TypeScript y al catálogo Laravel;
2. elegir un frame existente o crear uno solo si cambia la geometría física;
3. elegir una familia visual existente para WhatsApp, SMS y llamadas;
4. declarar colores opcionales si es una variante cromática;
5. añadir un único objeto a `mobilePreviewProfiles`.

No se debe volver a crear un árbol completo `mobile-N/{whatsapp,sms,calls}` cuando el nuevo diseño solo combina piezas existentes.

Este plan no implementa Mobile-5 ni cambia catálogos para habilitarlo. Prepara la arquitectura para que Mobile-5 y los siguientes se agreguen de forma declarativa. Tampoco añade dependencias de testing.

Reglas innegociables:

- No cambiar SVG, `path`, `viewBox`, `stroke`, `strokeWidth`, `width`, `height` ni geometría de iconos.
- No cambiar clases o estilos de `padding`, `margin`, `gap`, tamaños, radios, sombras, tipografía, line-height, máscaras o wallpaper.
- No convertir todos los móviles en un solo componente visual parametrizado.
- No deduplicar componentes solo porque sus nombres coinciden. Se deduplican únicamente archivos byte-idénticos o wrappers sin markup.
- No regenerar el baseline visual después de iniciar la migración. Un hash diferente es un fallo que debe corregirse.
- No borrar registros desconocidos de base de datos. Se filtran en el límite del catálogo.
- Cada canal conserva `buildMobilePreviewNotificationIds(data, profile.key, channel)`; nunca se hereda el seed del móvil base.

## 2. Diagnóstico del estado actual

### Estado de verificación observado el 7 de septiembre de 2026

- `git status --short`: limpio.
- `pnpm.cmd exec tsc`: pasa.
- Suite frontend focal actual: 44 pruebas pasan, 0 fallan.
- El proyecto no tiene Vitest, Playwright ni Puppeteer; las pruebas TypeScript usan `node:test` y algunas cargan módulos mediante Vite SSR.
- El CLI `php` no está disponible en el shell inspeccionado. El ejecutor deberá correr las pruebas Pest en un entorno que sí tenga PHP antes de declarar la tarea terminada.
- La base de datos contiene `mobile-1` a `mobile-5`, aunque el código y `MobileDesignKey` solo soportan `mobile-1` a `mobile-4`. También existe una selección de usuario con `mobile-5`. Es residuo de datos, no una implementación visual: no borrarlo; impedir que llegue a React hasta que la clave sea soportada.

### Inventario visual congelado

| Móvil | Frame y chrome del sistema | WhatsApp | SMS | Llamadas |
|---|---|---|---|---|
| Mobile-1 | `448.5 × 950`, `max-height: calc(100vh - 2rem)`, sin `p-5`; status bar y navegación Samsung de tres botones propios. Conservar incluso `bg-slate-150` tal como está. | Familia visual propia y behavior `mobile-1`. Header con estado online, bubble de 15 px, padding horizontal `px-3.75`, sombra `0 1.25px 0.625px`; wallpaper claro `#F5F2ED/#E9E4DE`, oscuro `#0B1014/#252A2E`. | Motor de Mobile-3 con variant `mobile-1`, videollamada visible, frame Mobile-1. | Frame Mobile-1 + contenido shared. Design-2 usa `spacingVariant="mobile-1"`. |
| Mobile-2 | `418.75 × 875`, `max-height: calc(100vh - 2.5rem)`, `p-5`; status bar Android y footer Android propios. | Familia visual propia, behavior `standard`. Header sin label online, título de 18.75 px, avatar 48; bubble de 16.25 px, metadata 13.75 px, padding 15 px, sombra `0 1px 0.5px`. | Motor de Mobile-3 con variant `mobile-2`, sin videollamada, frame Mobile-2 y orden propio de navegación. | Frame Mobile-2 + contenido shared. |
| Mobile-3 | `487.5 × 950`, `max-height: calc(100vh - 2.5rem)`, `p-5`; el archivo se llama históricamente `Mobile1PreviewFrame.tsx`; status bar propia y footer de gesto `120 × 6.25`. | Familia visual propia, behavior `standard`. Header con online, título 16.25 px; bubble de 15 px, metadata 12.5 px, sombra `0 1px 0.5px`; wallpaper claro `#F5F2ED/#EEE6DD`, oscuro `#0B1014/#252626`. | Es la fuente de verdad actual para las variants `mobile-1`, `mobile-2`, `mobile-3`. | Frame Mobile-3 + contenido shared. |
| Mobile-4 | `418.75 × 875`, sin padding exterior ni fondo de tema; capture fijo blanco; status bar propia y footer de gesto reutilizado de Mobile-3. | Renderer excepcional: header Mobile-1 + conversación/adapter Mobile-3 + behavior `standard`; aplica Google Sans Flex y ajustes visuales mediante un bloque CSS scoped. Ese bloque se conserva sin reescribir en esta refactorización. | Motor de Mobile-3 con variant `mobile-2`, sin videollamada, frame/status bar Mobile-4. | Solo design-1 en el flujo activo; frame Mobile-4 + `IncomingCallContent` shared. |

### Qué ya se reutiliza correctamente

- Lógica de WhatsApp: `shared/whatsapp/WhatsappConversation.tsx`, runtime, generación de mensajes, identidad, behavior profiles y reglas de replies.
- Llamadas: `shared/calls/IncomingCallContent.tsx` y `MissedCallContent.tsx`.
- SMS: un solo motor real, aunque está mal ubicado dentro de `mobile-3/sms`.
- Mobile-4 ya demuestra que una combinación de frame/header/adapter existentes es viable.
- `PreviewChannels.tsx` usa un registry exhaustivo con `satisfies Record<MobileDesignKey, ...>`.

### Qué se repite o está en el lugar equivocado

- Doce wrappers de canal repiten validación de `data`, frame, seed y composición.
- `avatarTheme.ts`, `contactIdentityDisplay.ts`, `whatsappAppearance.ts` y `whatsappTypes.ts` de Mobile-1/2/3 son aliases idénticos de shared.
- `buildWhatsappConversation.tsx` de Mobile-2/3 solo reexporta shared; el wrapper de Mobile-1 únicamente fija behavior `mobile-1`.
- `WhatsappConversation.tsx` de Mobile-1/2/3 solo inyecta adapter/behavior.
- `MoreConversationIndicator.tsx` es byte-idéntico en Mobile-1/2/3.
- `WhatsappMobileInputBar.tsx` de Mobile-2 y Mobile-3 es byte-idéntico.
- Las interfaces del visual adapter usan `ComponentType<any>`, por lo que una incompatibilidad llega tarde.
- El catálogo Laravel, la tabla `mobile_designs`, las selecciones de usuario y el registry React pueden divergir. Hoy la base tiene una clave que React no sabe renderizar.
- Varias pruebas backend tienen expectativas antiguas de tres móviles o asumen una tabla inicialmente vacía aunque las migraciones ya registran Mobile-4.

### Duplicación que no se debe fusionar todavía

Mantener separados los headers, bubbles, wallpapers y `WhatsappPieces.tsx` de Mobile-1, Mobile-2 y Mobile-3. Hay diferencias reales de tipografía, padding, sombras, avatar, presencia online, colores y geometría. Una futura unificación de esos visuales requiere screenshots de navegador; no pertenece a esta refactorización.

## 3. Arquitectura destino

```text
resources/js/evidence-generator/features/preview/designs/
├── mobilePreviewProfiles.tsx
├── MobilePreviewVisualParity.test.ts
├── mobile-preview-visual-baseline.json
├── shared/
│   ├── mobile-preview/
│   │   ├── mobilePreviewTypes.ts
│   │   ├── frameRenderers.tsx
│   │   ├── MobileWhatsappPreview.tsx
│   │   ├── MobileSmsPreview.tsx
│   │   ├── MobileCallPreview.tsx
│   │   ├── buildMobilePreviewRegistry.tsx
│   │   └── index.ts
│   ├── whatsapp/
│   │   ├── whatsappColorProfile.tsx
│   │   ├── standard/
│   │   │   ├── MoreConversationIndicator.tsx
│   │   │   └── WhatsappMobileInputBar.tsx
│   │   └── ... lógica shared actual
│   ├── sms/
│   │   └── ... contenido movido sin cambios desde mobile-3/sms
│   └── calls/
│       └── ... contenido shared actual
├── mobile-1/
│   ├── ... frame/chrome actual
│   └── whatsapp/ ... visuales propios + adapter
├── mobile-2/
│   ├── ... frame/chrome actual
│   └── whatsapp/ ... visuales propios + adapter
├── mobile-3/
│   ├── ... frame/chrome actual
│   └── whatsapp/ ... visuales propios + adapter
└── mobile-4/
    ├── ... frame/chrome actual
    └── whatsapp/PreviewMobile4Whatsapp.tsx  # excepción visual conservada
```

No renombrar `mobile-3/Mobile1PreviewFrame.tsx` dentro de este trabajo: el nombre es feo, pero renombrarlo aumenta el diff sin mejorar la capacidad de composición.

### Contratos obligatorios

Crear `shared/mobile-preview/mobilePreviewTypes.ts` con estos conceptos. Los nombres pueden ajustarse solo para resolver una colisión real; no cambiar su responsabilidad:

```ts
import type { ComponentType, ReactElement, ReactNode } from 'react';
import type { MobileDesignKey, PreviewProps, PreviewThemeMode, SavedData } from '../../../../../types';
import type { MobileNotificationIconId } from '../../../mobileNotifications';
import type { SmsDesignVariant } from '../sms/smsTypes';
import type { WhatsappColorProfile } from '../whatsapp/whatsappColorProfile';
import type { WhatsappBehaviorProfile, WhatsappData, WhatsappMessageStatus } from '../whatsapp/whatsappTypes';
import type { WhatsappMobileVisualAdapter } from '../whatsapp/whatsappVisualAdapter';

export type MobilePreviewChannel = 'whatsapp' | 'sms' | 'call';

export interface WhatsappMobileHeaderProps {
    data: WhatsappData;
    status?: WhatsappMessageStatus;
    showTemporaryIndicator?: boolean;
    displayTitle?: string;
    themeMode?: PreviewThemeMode;
}

export interface MobileFrameRenderProps {
    children: ReactNode;
    data: SavedData;
    themeMode: PreviewThemeMode;
    channel: MobilePreviewChannel;
    notificationIds: MobileNotificationIconId[];
    smsShellColor?: string;
    systemChrome?: MobileSystemChromeProfile;
}

export interface MobileSystemChromeProfile {
    headerBackground?: string;
    headerForeground?: string;
    footerBackground?: string;
    footerForeground?: string;
}

export type MobileFrameRenderer = (props: MobileFrameRenderProps) => ReactElement;

export type ComposedMobileWhatsappProfile = {
    kind: 'composed';
    Header: ComponentType<WhatsappMobileHeaderProps>;
    behaviorProfile: WhatsappBehaviorProfile;
    visualAdapter: WhatsappMobileVisualAdapter;
    colors?: Record<PreviewThemeMode, WhatsappColorProfile>;
    systemChrome?: Record<PreviewThemeMode, MobileSystemChromeProfile>;
};

export type CustomMobileWhatsappProfile = {
    kind: 'custom';
    Preview: ComponentType<PreviewProps>;
};

export interface MobilePreviewDesignProfile {
    key: MobileDesignKey;
    renderFrame: MobileFrameRenderer;
    whatsapp: ComposedMobileWhatsappProfile | CustomMobileWhatsappProfile;
    sms: {
        variant: SmsDesignVariant;
        showVideoCall: boolean;
    };
    call: {
        missedSpacingVariant?: 'mobile-1' | 'standard';
    };
}
```

Mantener el contrato y los tipos exactamente como arriba. No usar `any`.

Crear `shared/whatsapp/whatsappColorProfile.tsx`:

```tsx
import { createContext, useContext, type ReactNode } from 'react';

export type WhatsappColorProfile = {
    headerBackground: string;
    headerText: string;
    headerIcons: string;
    conversationBackground: string;
    wallpaperPattern: string;
    outgoingBubble: string;
    outgoingText: string;
    outgoingMetadata: string;
    incomingBubble: string;
    incomingText: string;
    incomingMetadata: string;
    readChecks: string;
    dateChipBackground: string;
    dateChipText: string;
    composerBackground: string;
    composerText: string;
    composerIcons: string;
    microphoneBackground: string;
    microphoneIcon: string;
    avatarBackground?: string;
    avatarText?: string;
};

const WhatsappColorProfileContext = createContext<WhatsappColorProfile | undefined>(undefined);

export function WhatsappAppearanceProvider({ colors, children }: { colors: WhatsappColorProfile; children: ReactNode }) {
    return <WhatsappColorProfileContext.Provider value={colors}>{children}</WhatsappColorProfileContext.Provider>;
}

export function useWhatsappColorProfile(): WhatsappColorProfile | undefined {
    return useContext(WhatsappColorProfileContext);
}
```

La ausencia de provider es el contrato de compatibilidad. No crear una paleta default en el contexto. Cuando `useWhatsappColorProfile()` devuelve `undefined`, cada componente debe conservar sus clases y estilos actuales byte por byte en el markup renderizado.

Tipar `shared/whatsapp/whatsappVisualAdapter.ts` con props explícitas para background, chip, mensajes de sistema, bubble, indicador e input. Extraer `WhatsappBubbleProps` y `WhatsappQuotedMessage` de la firma real actual. Eliminar `eslint-disable` y los nueve `ComponentType<any>`. No modificar los componentes para satisfacer tipos; el contrato debe describir lo que ya reciben.

## FASE 1 — Congelar la salida visual y construir el núcleo declarativo

### 1.1 Registrar el baseline antes de tocar producción

**Crear:**

- `resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts`
- `resources/js/evidence-generator/features/preview/designs/mobile-preview-visual-baseline.json`

- [ ] Crear una prueba Node integrada, no 24 archivos de snapshot. Debe abrir un único Vite server en `before`, cargar `mobilePreviewRegistry` con `ssrLoadModule`, cerrarlo en `after` y renderizar con `renderToStaticMarkup`.
- [ ] Usar una fixture determinista que contenga nombre, teléfono, DNI, fechas, avatar vacío, seed fijo y mensajes generados de ambos lados. Incluir un outgoing con `status: 'read'`, un incoming, un quote, texto fuerte y dos `dateKey` para cubrir checks, reply, formato y DayChip.
- [ ] La fixture debe llevar `previewSnapshot.messageStatus = 'read'`, `showDefaultTemporalMessage = true`, `inlineTemporalMode = 'active'` e `inlineTemporalInsertIndex = 1`, de modo que cifrado, temporal default y temporal inline estén simultáneamente en el DOM.
- [ ] Usar esta fixture exacta y tiparla como `SavedData`; no reutilizar factories aleatorias:

```ts
const previewData: SavedData = {
    telefono: '999 111 222',
    nombre: 'Cliente Visual',
    dniCliente: '12345678',
    monto: '1000',
    tasa: '10',
    cuota: '100',
    plazo: '12',
    TCEA: '12.50',
    fechaHora: '2026-09-07T10:00',
    fechaHoraRegistro: '2026-09-07T09:55',
    duracion: '00:45',
    img_64: '',
    img_64_file: null,
    modoEntrada: 'contactado',
    nombreAsesor: 'Asesora Visual',
    dni: '87654321',
    sexualidadAsesor: 'F',
    tipoCliente: 'sereno',
    conversationId: 'visual-parity-conversation',
    seedCode: 'visual-parity-seed',
    generatedMessages: [
        {
            id_: 'visual-in-1',
            side: 'in',
            time: '10:00',
            dateKey: '2026-09-07',
            lines: ['Mensaje recibido *importante* 12345678'],
        },
        {
            id_: 'visual-out-1',
            side: 'out',
            time: '10:01',
            dateKey: '2026-09-07',
            lines: ['Mensaje enviado con confirmación'],
            status: 'read',
            quote: { side: 'in', text: 'Mensaje recibido importante' },
        },
        {
            id_: 'visual-in-2',
            side: 'in',
            time: '10:02',
            dateKey: '2026-09-08',
            lines: ['Segundo día de conversación'],
        },
    ],
    previewSnapshot: {
        messageStatus: 'read',
        showRightInfoPanel: false,
        temporalBehavior: {
            showTemporaryIcon: true,
            showDefaultTemporalMessage: true,
            temporalStatusLabel: '90 días',
            inlineTemporalMode: 'active',
        },
        inlineTemporalInsertIndex: 1,
        trayTime: '10:02',
        trayDate: '07/09/2026',
        trayProfile: {
            taskbarColor: '#000000',
            icons: [],
            language: { top: 'ESP' },
            languagePosition: 'next-to-hidden',
        },
    },
};
```
- [ ] Durante cada render sustituir temporalmente `Math.random` por `() => 0.25` y `Date` por una fecha fija `2026-09-07T15:00:00.000Z`; restaurarlos en `finally`.
- [ ] Recorrer en orden fijo `mobile-1` a `mobile-4`, luego `whatsapp`, `sms`, `call`, y finalmente `light`, `dark`: exactamente 24 keys con formato `mobile-1/whatsapp/light`.
- [ ] Calcular `createHash('sha256').update(markup).digest('hex')` por caso.
- [ ] En modo normal, comparar el objeto completo con `mobile-preview-visual-baseline.json`.
- [ ] Permitir grabación solamente cuando `UPDATE_MOBILE_VISUAL_BASELINE === '1'`; en ese modo escribir JSON ordenado con dos espacios y newline final. Añadir en el mensaje del test: `Baseline recording is only allowed before production refactoring`.
- [ ] Ejecutar la grabación ahora, con el árbol aún intacto:

```powershell
$env:UPDATE_MOBILE_VISUAL_BASELINE = '1'
node --test resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts
Remove-Item Env:UPDATE_MOBILE_VISUAL_BASELINE
```

- [ ] Ejecutar inmediatamente en modo normal y comprobar que pasa:

```powershell
node --test resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts
```

- [ ] Commit de seguridad antes de refactorizar:

```powershell
git add resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts resources/js/evidence-generator/features/preview/designs/mobile-preview-visual-baseline.json
git commit -m "test: freeze mobile preview markup"
```

Desde este punto queda prohibido ejecutar el modo de grabación.

### 1.2 Mover fuentes de verdad sin alterar contenido

- [ ] Mover `mobile-3/sms/**` completo a `designs/shared/sms/**`. Conservar contenido, nombres y jerarquía interna. Comparar hashes SHA-256 antes y después de cada archivo; solo deben cambiar imports relativos.
- [ ] Actualizar los imports de Mobile-1, Mobile-2, Mobile-3, Mobile-4 y `PreviewMobile2Sms.test.ts` para apuntar a `shared/sms`.
- [ ] Mover una sola copia de `MoreConversationIndicator.tsx` a `shared/whatsapp/standard/MoreConversationIndicator.tsx`; verificar primero que las tres copias tienen el mismo hash y después hacer que los tres adapters importen la copia shared.
- [ ] Mover la copia de Mobile-3 de `WhatsappMobileInputBar.tsx` a `shared/whatsapp/standard/WhatsappMobileInputBar.tsx`; verificar que Mobile-2 y Mobile-3 eran byte-idénticas. Hacer que los adapters Mobile-2/Mobile-3 usen shared. Mobile-1 conserva su input propio.
- [ ] No mover bubbles, headers, wallpapers ni `WhatsappPieces.tsx`.
- [ ] Ejecutar el test de paridad. Si cambia un hash, revertir el movimiento problemático antes de continuar.

### 1.3 Añadir apariencia opcional sin cambiar defaults

**Crear:** `shared/whatsapp/whatsappColorProfile.tsx` con el contrato anterior.

**Modificar solo en la familia visual Mobile-3/standard:**

- `mobile-3/whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx`
- `mobile-3/whatsapp/WhatsappPieces.tsx` — únicamente `DayChip`
- `mobile-3/whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx`
- `mobile-3/whatsapp/whatsapp-background/WhatsappConversationBackground.tsx` y sus dos superficies si allí se resuelven base/pattern
- `shared/whatsapp/standard/WhatsappMobileInputBar.tsx`
- `mobile-3/Mobile1PreviewFrame.tsx`, `Mobile1PreviewHeader.tsx` y `Mobile1PreviewFooter.tsx` — solo props opcionales de system chrome

- [ ] Leer `useWhatsappColorProfile()` en esos componentes.
- [ ] Mantener la expresión de clases actual cuando no hay profile. No reemplazar defaults por variables globales ni tokens nuevos.
- [ ] Cuando sí hay profile, retirar solo la clase de color que competiría y aplicar `style={{ backgroundColor, color }}`. No tocar otras clases ni el orden de las restantes.
- [ ] En tails y checks conservar el SVG exacto; únicamente `currentColor` puede heredar `outgoingBubble`, `incomingBubble` o `readChecks`.
- [ ] No aplicar profile a quotes, encryption, mensajes temporales, links ni `MoreConversationIndicator`; esos campos no existen en el contrato.
- [ ] Las props de chrome deben ser opcionales y producir exactamente el JSX anterior cuando sean `undefined`.
- [ ] No configurar `colors` ni `systemChrome` para Mobile-1/2/3/4.
- [ ] Ejecutar paridad después de cada uno de los cinco grupos visuales: header, bubble, DayChip, wallpaper, composer/chrome. Es la misma prueba, no crear pruebas unitarias nuevas.

### 1.4 Crear renderers y perfiles

**Crear:**

- `shared/mobile-preview/mobilePreviewTypes.ts`
- `shared/mobile-preview/frameRenderers.tsx`
- `shared/mobile-preview/MobileWhatsappPreview.tsx`
- `shared/mobile-preview/MobileSmsPreview.tsx`
- `shared/mobile-preview/MobileCallPreview.tsx`
- `shared/mobile-preview/buildMobilePreviewRegistry.tsx`
- `shared/mobile-preview/index.ts`
- `designs/mobilePreviewProfiles.tsx`

- [ ] En `frameRenderers.tsx` exportar cuatro funciones estables: `renderMobile1Frame`, `renderMobile2Frame`, `renderMobile3Frame`, `renderMobile4Frame`. Cada una debe envolver el frame existente y reproducir exactamente sus props por canal:
  - WhatsApp: `headerVariant="whatsapp"` en Mobile-1/2/3.
  - SMS: `headerVariant="sms"` y `footerVariant="sms"` en Mobile-1/2/3.
  - Call: variants default.
  - Mobile-4 SMS light: `statusBarBackground={smsShellColor}`.
  - Mobile-4 call: sin `statusBarBackground`.
  - Mobile-4 WhatsApp no usa este renderer mientras siga siendo custom.
- [ ] `MobileWhatsappPreview` debe retornar `EmptyState` sin `data`; construir `buildWhatsappPreviewRuntime(data)` una vez con `useMemo`; calcular notificaciones con `profile.key`; renderizar header y `shared/whatsapp/WhatsappConversation` con adapter y behavior del profile.
- [ ] El shell composed de WhatsApp debe conservar exactamente `data-whatsapp-platform="android"`, `flex h-full min-h-0 flex-col` y los fondos actuales de Mobile-1/2/3 cuando no hay profile.
- [ ] Si `profile.whatsapp.colors` existe, envolver solo el contenido WhatsApp con `WhatsappAppearanceProvider`. Si no existe, no renderizar provider.
- [ ] `MobileSmsPreview` debe usar exclusivamente `shared/sms/SmsMobileHeader`, `SmsConversation`, `getSmsColors`; pasar variant/showVideoCall del profile y seed `profile.key`.
- [ ] `MobileCallPreview` debe usar exclusivamente `IncomingCallContent`, el frame renderer y seed `profile.key`. Mantener `MissedCallContent` disponible en shared, pero no inventar un selector de design-2 que el flujo actual no expone.
- [ ] `buildMobilePreviewRegistry` debe crear componentes estables en scope de módulo, no dentro del render de `PreviewWhatsApp`. El resultado debe ser `Record<MobileDesignKey, MobilePreviewRegistration>`.
- [ ] Definir perfiles exhaustivos:

| Key | Frame | WhatsApp | SMS | Call |
|---|---|---|---|---|
| `mobile-1` | `renderMobile1Frame` | composed: header M1, adapter M1, behavior `mobile-1` | variant `mobile-1`, video `true` | missed spacing `mobile-1` |
| `mobile-2` | `renderMobile2Frame` | composed: header M2, adapter M2, behavior `standard` | variant `mobile-2`, video `false` | spacing `standard` |
| `mobile-3` | `renderMobile3Frame` | composed: header M3, adapter M3, behavior `standard` | variant `mobile-3`, video `true` | spacing `standard` |
| `mobile-4` | `renderMobile4Frame` | custom: `PreviewMobile4Whatsapp` | variant `mobile-2`, video `false` | spacing `standard` |

- [ ] Exportar aparte `mobile3WhatsappFamily` y `mobile3SmsFamily` como objetos frozen reutilizables. Un futuro Mobile-5 podrá hacer spread de esas familias y añadir colores, sin copiar componentes.
- [ ] Declarar `mobilePreviewProfiles` con `satisfies Record<MobileDesignKey, MobilePreviewDesignProfile>` y además comprobar en runtime de desarrollo que `profile.key === objectKey`.
- [ ] En el mismo `mobilePreviewProfiles.tsx`, exportar `mobilePreviewRegistry = buildMobilePreviewRegistry(mobilePreviewProfiles)`. Este será el único registry móvil concreto.
- [ ] Mobile-4 debe importar directamente `buildWhatsappPreviewRuntime`; eliminar el alias `mobile4WhatsappRuntime.ts` solo después de que `Mobile4Preview.test.ts` compruebe la misma lógica shared. No cambiar su bloque `<style>` ni su markup.
- [ ] Ejecutar `pnpm.cmd exec tsc` y la prueba de paridad.

### 1.5 Cerrar la deriva de catálogo en Laravel

**Modificar:**

- `app/Support/MobileDesignCatalog.php`
- `routes/web.php`
- `app/Http/Controllers/Settings/ProfileController.php`
- `app/Http/Requests/Settings/ProfileUpdateRequest.php`

- [ ] Antes de editar PHP, consultar Laravel Boost `search-docs` con `packages: ['laravel/framework', 'inertiajs/inertia-laravel']` y queries `['validation rule in exists', 'database transactions', 'inertia testing props']`. Usar la documentación correspondiente a las versiones instaladas.
- [ ] Mantener `available()` como fuente canónica y el orden actual Mobile-1..4.
- [ ] Añadir `filterSupported(iterable $designKeys): array`, que elimine valores no string/no soportados, elimine duplicados y devuelva siempre en orden de catálogo.
- [ ] Añadir `registeredDefinitions(iterable $designKeys): array`, que devuelva metadata del catálogo para las claves filtradas y cambie únicamente `status` a `registered`.
- [ ] En `/inicio`, aplicar `filterSupported` a `globalMobileDesigns` y `registeredMobileDesigns`. Intersectar además las selecciones del usuario con las claves globalmente registradas.
- [ ] En `ProfileController::edit`, usar `registeredDefinitions` para opciones y convertir una selección no soportada/no global en `null`. No borrar su fila como efecto lateral de una lectura.
- [ ] En `ProfileUpdateRequest`, validar `mobile_design_key` con ambas reglas: `Rule::in(MobileDesignCatalog::keys())` y `Rule::exists('mobile_designs', 'design_key')`.
- [ ] En `ProfileController::update`, envolver guardado del usuario, borrado de selección anterior y creación de selección nueva en `DB::transaction`.
- [ ] No editar migraciones históricas, no crear FK nueva y no borrar el `mobile-5` residual. La normalización de constraints de base de datos queda fuera para evitar una decisión destructiva sobre datos existentes.
- [ ] Formatear PHP:

```powershell
vendor/bin/pint --dirty --format agent
```

- [ ] Commit del núcleo antes de borrar wrappers:

```powershell
git add app/Support/MobileDesignCatalog.php app/Http/Controllers/Settings/ProfileController.php app/Http/Requests/Settings/ProfileUpdateRequest.php routes/web.php
git add resources/js/evidence-generator/features/preview/designs/shared resources/js/evidence-generator/features/preview/designs/mobilePreviewProfiles.tsx
git add resources/js/evidence-generator/features/preview/designs/mobile-1 resources/js/evidence-generator/features/preview/designs/mobile-2 resources/js/evidence-generator/features/preview/designs/mobile-3 resources/js/evidence-generator/features/preview/designs/mobile-4
git commit -m "refactor: add declarative mobile preview profiles"
```

Antes de cada `git add`, revisar `git status --short`; no incluir cambios del usuario que no pertenezcan a este plan.

## FASE 2 — Migrar el registry, retirar duplicación segura y certificar paridad

### 2.1 Cambiar el punto único de selección

**Modificar:** `resources/js/evidence-generator/features/preview/components/PreviewChannels.tsx`

- [ ] Eliminar imports de los doce entrypoints por móvil.
- [ ] Importar `mobilePreviewRegistry` desde `../designs/mobilePreviewProfiles`.
- [ ] Mantener sin cambios las interfaces públicas `PreviewWhatsApp`, `PreviewLlamada`, `PreviewSMS` y `MobilePreviewRegistration` (esta última puede moverse y reexportarse).
- [ ] Mantener lookup directo `mobilePreviewRegistry[mobileDesignKey][channel]`; no introducir `if/else` ni fallback silencioso.
- [ ] Verificar que `mobilePreviewRegistry` sigue siendo exhaustivo respecto de `MobileDesignKey`.
- [ ] Ejecutar paridad. Los 24 hashes deben coincidir exactamente.

### 2.2 Borrar únicamente composición y aliases comprobados

Antes de cada borrado ejecutar `rg -n` con el nombre exportado y la ruta. Si existe un consumidor fuera del archivo que también será migrado en este paso, actualizarlo; si existe un consumidor no contemplado, conservar el archivo.

- [ ] Eliminar los wrappers `PreviewMobile*Whatsapp.tsx` de Mobile-1/2/3; conservar `mobile-4/whatsapp/PreviewMobile4Whatsapp.tsx`.
- [ ] Eliminar `WhatsappConversation.tsx` local de Mobile-1/2/3.
- [ ] Eliminar wrappers `PreviewMobile*Sms.tsx` de Mobile-1/2/3/4 después de que el registry use `MobileSmsPreview`.
- [ ] Eliminar wrappers `calls/design-1/PreviewMobile*CallDesign1.tsx` de Mobile-1/2/3/4 después de que el registry use `MobileCallPreview`.
- [ ] Conservar por ahora `calls/design-2` fuera del registry o migrarlo al renderer shared solo si `rg` descubre un consumidor real. No añadir funcionalidad al flujo activo.
- [ ] Redirigir headers/tests a `shared/whatsapp/{avatarTheme,whatsappAppearance,whatsappTypes}` y borrar los aliases locales de Mobile-1/2/3.
- [ ] Borrar `buildWhatsappConversation.tsx`, `contactIdentityDisplay.ts` y `conversationReplyRules.ts` locales que no tengan consumidores. Conservar `shared/whatsapp/conversationReplyRulesMobile1.ts` porque contiene behavior real.
- [ ] Actualizar o eliminar los `index.ts` que solo exportaban wrappers retirados. No dejar exports rotos.
- [ ] No borrar ningún visual adapter, header, bubble, wallpaper, frame, status bar, footer o icono que diferencie un móvil.
- [ ] Ejecutar paridad después de cada grupo de borrados, no crear pruebas nuevas.

### 2.3 Ajustar las pruebas existentes, sin multiplicar suites

**Modificar únicamente:**

- `resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts`
- `resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4Preview.test.ts`
- `resources/js/evidence-generator/features/preview/designs/mobile-2/sms/PreviewMobile2Sms.test.ts` o su nueva ubicación bajo `shared/sms`
- `tests/Feature/MobileDesignSeederTest.php`
- `tests/Feature/MobileDesignRegistrationTest.php`
- `tests/Feature/DashboardTest.php`
- `tests/Feature/ProfileSettingsTest.php`

- [ ] Reescribir el bloque mobile de `PreviewDesignStructure.test.ts` para exigir los seis módulos shared, `mobilePreviewProfiles.tsx`, los cuatro frames y la excepción de Mobile-4. Debe rechazar nuevos wrappers `PreviewMobileNWhatsapp/Sms/Call` para diseños composed.
- [ ] Añadir aserciones de que el profile de cada móvil referencia el frame, adapter, behavior y SMS variant de la tabla de perfiles.
- [ ] Mantener los tests visuales específicos de Mobile-4, pero actualizar su expectativa de runtime para import directo shared.
- [ ] Actualizar la ruta del test SMS después del movimiento; conservar sus assertions visuales actuales.
- [ ] En `MobileDesignSeederTest`, sembrar `MobileDesignSeeder::class` dos veces en vez de `DatabaseSeeder::class` y comparar contra las cuatro claves del catálogo.
- [ ] En `MobileDesignRegistrationTest`, sustituir `assertDatabaseCount('mobile_designs', 1)` por una cuenta filtrada de `design_key = mobile-1`; las migraciones ya pueden contener otros diseños.
- [ ] En `DashboardTest`, esperar Mobile-1..4 y añadir en el mismo test filas desconocidas para demostrar que no pasan en `globalMobileDesigns` ni `registeredMobileDesigns`.
- [ ] En `ProfileSettingsTest`, usar `firstOrCreate` para Mobile-4 y añadir al test existente que una clave residual no soportada no aparece ni queda seleccionada.
- [ ] No crear un test separado por móvil, canal, tema o color. La prueba integrada de paridad cubre la salida visual y los tests actuales conservan comportamientos particulares.

### 2.4 Verificación final obligatoria

Ejecutar en este orden:

```powershell
node --test resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4Preview.test.ts resources/js/evidence-generator/features/preview/mobileNotifications.test.ts resources/js/evidence-generator/lib/mobileDesignSelection.test.ts
pnpm.cmd exec tsc
pnpm.cmd run build
pnpm.cmd exec eslint resources/js/evidence-generator/features/preview/components/PreviewChannels.tsx resources/js/evidence-generator/features/preview/designs --max-warnings=0
php artisan test --compact tests/Feature/MobileDesignSeederTest.php tests/Feature/MobileDesignRegistrationTest.php tests/Feature/DashboardTest.php tests/Feature/ProfileSettingsTest.php
vendor/bin/pint --dirty --format agent
git diff --check
```

- [ ] Si Pint modifica PHP, volver a ejecutar las cuatro pruebas Pest.
- [ ] Ejecutar `git status --short`, `git diff --stat` y `git diff`.
- [ ] Confirmar que no hay cambios en archivos `.svg`:

```powershell
git diff --name-only -- '*.svg'
```

- [ ] Auditar cambios sospechosos de geometría/typography:

```powershell
git diff -G 'viewBox|<path|strokeWidth|stroke-width|width=|height=|padding|margin|gap-|text-\[|font-|leading-|rounded-' -- resources/js/evidence-generator/features/preview/designs
```

- [ ] Para cada coincidencia, aceptar solamente: imports, tipos, props opcionales de color o movimiento byte-idéntico. Revertir cualquier cambio de geometría.
- [ ] Confirmar que el JSON baseline no cambió desde el primer commit:

```powershell
git diff HEAD~1 -- resources/js/evidence-generator/features/preview/designs/mobile-preview-visual-baseline.json
```

- [ ] Hacer el commit final solo con todas las verificaciones verdes:

```powershell
git add resources/js/evidence-generator/features/preview/components/PreviewChannels.tsx resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts
git add tests/Feature/MobileDesignSeederTest.php tests/Feature/MobileDesignRegistrationTest.php tests/Feature/DashboardTest.php tests/Feature/ProfileSettingsTest.php
git add -u resources/js/evidence-generator/features/preview/designs/mobile-1 resources/js/evidence-generator/features/preview/designs/mobile-2 resources/js/evidence-generator/features/preview/designs/mobile-3 resources/js/evidence-generator/features/preview/designs/mobile-4
git commit -m "refactor: migrate mobile previews to shared composition"
```

## 4. Estrategia mínima de pruebas

Se añade exactamente **un archivo de prueba nuevo**: `MobilePreviewVisualParity.test.ts`. No se añade framework ni dependencia.

Cobertura mínima total:

1. **Paridad de render:** una prueba parametrizada produce los 24 hashes de todos los móviles/canales/temas.
2. **Estructura:** se modifica el test existente para garantizar perfiles exhaustivos y prohibir que vuelva la duplicación de wrappers.
3. **Casos especiales:** se conservan los tests existentes de Mobile-4, SMS y notificaciones.
4. **Catálogo backend:** se corrigen cuatro archivos Pest existentes; no se crea suite nueva.
5. **Compilación:** TypeScript, build y lint detectan imports/exports o Tailwind inválidos.

No usar snapshots por componente, tests de colores individuales, tests por adapter ni fixtures separadas por móvil. Eso aumentaría mantenimiento sin mejorar la garantía principal.

## 5. Criterios de aceptación

- Los 24 hashes finales son idénticos al baseline capturado antes del refactor.
- Mobile-1 conserva frame, chrome, WhatsApp y behavior propios.
- Mobile-2 conserva frame, chrome y visuales WhatsApp propios.
- Mobile-3 conserva frame, chrome y visuales WhatsApp propios.
- Mobile-4 conserva su renderer scoped, Google Sans Flex, header Mobile-1, adapter Mobile-3 y frame propio.
- SMS de los cuatro móviles usa `shared/sms` con las variants actuales.
- Calls usa contenido shared y el frame correcto.
- Los tres canales generan notification IDs con la clave del profile activo.
- No queda `ComponentType<any>` en `WhatsappMobileVisualAdapter`.
- No existen wrappers de composición por móvil para profiles `kind: 'composed'`.
- No se modificó ningún SVG ni ninguna geometría visual.
- Sin `WhatsappAppearanceProvider`, Mobile-1/2/3/4 producen exactamente el markup anterior.
- El backend nunca envía a React una clave fuera de `MobileDesignCatalog::keys()`.
- Los residuos `mobile-5` permanecen en base de datos, pero no son seleccionables hasta que exista soporte real.
- TypeScript, build, lint, Pest, Pint y `git diff --check` pasan.

## 6. Receta posterior para Mobile-N

Una vez completado este plan, un móvil que reutilice Mobile-3 con otra paleta no debe crear header, bubble, composer, conversation, SMS ni calls. Debe:

1. añadir `'mobile-N'` a `MobileDesignKey`, `WhatsappDesignVariant`, behavior profile y `MobileDesignCatalog`;
2. crear solo `mobile-N/mobileNColors.ts` si tiene paleta propia;
3. declarar un profile:

```tsx
'mobile-N': {
    key: 'mobile-N',
    renderFrame: renderMobile3Frame,
    whatsapp: {
        ...mobile3WhatsappFamily,
        colors: mobileNWhatsappColors,
        systemChrome: mobileNSystemChromeColors,
    },
    sms: mobile3SmsFamily,
    call: { missedSpacingVariant: 'standard' },
},
```

4. comprobar que el registry queda exhaustivo;
5. ejecutar la suite focal y añadir los nuevos seis casos al baseline solo en el commit que introduce Mobile-N, nunca durante la refactorización de Mobile-1..4.

Así, el costo normal de un móvil derivado pasa de copiar decenas de archivos a declarar una composición y, cuando corresponda, una paleta.
