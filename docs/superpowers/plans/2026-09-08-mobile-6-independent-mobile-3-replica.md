# Mobile 6 Independent Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir `mobile-6` como réplica visual inicial de `mobile-3` en WhatsApp, SMS y llamadas, con implementación propia para que ambos diseños puedan evolucionar sin afectarse.

**Architecture:** `mobile-6` tendrá frame, chrome y componentes visuales de WhatsApp propios, copiados una sola vez desde el estado actual de `mobile-3`. Solo reutilizará infraestructura neutral bajo `designs/shared`; su perfil no importará archivos ni familias de `mobile-3`. El backend lo expondrá mediante el catálogo canónico y una migración reversible e idempotente.

**Tech Stack:** Laravel 12, PHP 8.2+, Pest 3, Inertia React 2, React 19, TypeScript, Tailwind CSS 4 y Node Test Runner.

---

## FASE ÚNICA — Registrar y aislar Mobile 6

### Task 1: Pruebas contractuales inicialmente rojas

**Files:**

- Modify: `resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts`
- Modify: `tests/Feature/DashboardTest.php`
- Modify: `tests/Feature/MobileDesignRegistrationTest.php`
- No crear archivos de prueba nuevos.

- [ ] **Step 1: Ampliar la prueba visual existente**

En `MobilePreviewVisualParity.test.ts`, sustituir la lista local por:

```ts
const designKeys = ['mobile-1', 'mobile-2', 'mobile-3', 'mobile-4', 'mobile-5', 'mobile-6'];
```

No actualizar todavía `mobile-preview-visual-baseline.json`.

- [ ] **Step 2: Añadir el contrato de independencia al test estructural existente**

Cambiar el import de Node FS en `PreviewDesignStructure.test.ts` y añadir el helper y test siguientes:

```ts
import { existsSync, readFileSync, readdirSync } from 'node:fs';

function collectSourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = resolve(directory, entry.name);

        return entry.isDirectory() ? collectSourceFiles(entryPath) : [entryPath];
    });
}

test('mobile 6 owns its Mobile 3 replica without importing Mobile 3', () => {
    const mobile6Directory = resolve(designsDir, 'mobile-6');
    const profilesSource = readFileSync(resolve(designsDir, 'mobilePreviewProfiles.tsx'), 'utf8');
    const frameRenderersSource = readFileSync(resolve(designsDir, 'shared', 'mobile-preview', 'frameRenderers.tsx'), 'utf8');

    for (const relativePath of [
        'Mobile6PreviewFrame.tsx',
        'Mobile6PreviewHeader.tsx',
        'Mobile6PreviewFooter.tsx',
        'whatsapp/whatsappVisualAdapter.ts',
        'whatsapp/WhatsappPieces.tsx',
        'whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx',
        'whatsapp/whatsapp-bubbles/WhatsappMobileTextBubble.tsx',
        'whatsapp/whatsapp-background/WhatsappConversationBackground.tsx',
        'whatsapp/whatsapp-footer/WhatsappMobileInputBar.tsx',
    ]) {
        assert.equal(existsSync(resolve(mobile6Directory, relativePath)), true, `Missing ${relativePath}`);
    }

    const mobile6Source = collectSourceFiles(mobile6Directory)
        .map((filePath) => readFileSync(filePath, 'utf8'))
        .join('\n');

    assert.doesNotMatch(mobile6Source, /mobile-3|Mobile1Preview|mobile3Whatsapp/);
    assert.match(profilesSource, /from ['"]\.\/mobile-6\//);
    assert.match(profilesSource, /'mobile-6':\s*\{/);
    assert.match(profilesSource, /renderFrame: renderMobile6Frame/);
    assert.match(profilesSource, /whatsapp: mobile6WhatsappFamily/);
    assert.match(profilesSource, /sms: \{ variant: 'mobile-6', showVideoCall: true \}/);
    assert.doesNotMatch(profilesSource, /'mobile-6':[\s\S]*?mobile3WhatsappFamily/);
    assert.match(frameRenderersSource, /from ['"]\.\.\/\.\.\/mobile-6\/Mobile6PreviewFrame['"]/);
});
```

- [ ] **Step 3: Actualizar expectativas backend existentes**

En `DashboardTest.php` y en la expectativa `globalMobileDesigns` de `MobileDesignRegistrationTest.php`, usar:

```php
['mobile-1', 'mobile-2', 'mobile-3', 'mobile-4', 'mobile-5', 'mobile-6']
```

En el test existente `authenticated users can register mobile three globally`, registrar también `mobile-6` y comprobar la respuesta y la fila:

```php
$this->actingAs($user)
    ->postJson(route('mobile-designs.store'), [
        'design_key' => 'mobile-6',
    ])
    ->assertSuccessful()
    ->assertJsonPath('data.design_key', 'mobile-6');

$this->assertDatabaseHas('mobile_designs', [
    'design_key' => 'mobile-6',
]);
```

- [ ] **Step 4: Ejecutar solo las pruebas rojas necesarias**

```powershell
node --test resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts
php artisan test --compact tests/Feature/DashboardTest.php tests/Feature/MobileDesignRegistrationTest.php tests/Feature/MobileDesignSeederTest.php
```

Esperado: Node falla por el registro/archivos ausentes de `mobile-6`; Pest falla porque la clave aún no está en el catálogo.

### Task 2: Crear la implementación visual independiente

**Files:**

- Create: `resources/js/evidence-generator/features/preview/designs/mobile-6/Mobile6PreviewFrame.tsx`
- Create: `resources/js/evidence-generator/features/preview/designs/mobile-6/Mobile6PreviewHeader.tsx`
- Create: `resources/js/evidence-generator/features/preview/designs/mobile-6/Mobile6PreviewFooter.tsx`
- Create: `resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/**`
- Modify: `resources/js/evidence-generator/types.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobilePreviewProfiles.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/frameRenderers.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/index.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappTypes.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappProfiles.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsTypes.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsAppearance.ts`

- [ ] **Step 1: Copiar solamente las piezas visuales activas de Mobile 3**

Ejecutar desde la raíz del repositorio:

```powershell
New-Item -ItemType Directory -Force resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/Mobile1PreviewFrame.tsx resources/js/evidence-generator/features/preview/designs/mobile-6/Mobile6PreviewFrame.tsx
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/Mobile1PreviewHeader.tsx resources/js/evidence-generator/features/preview/designs/mobile-6/Mobile6PreviewHeader.tsx
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/Mobile1PreviewFooter.tsx resources/js/evidence-generator/features/preview/designs/mobile-6/Mobile6PreviewFooter.tsx
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/avatarTheme.ts resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/avatarTheme.ts
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsappAppearance.ts resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsappAppearance.ts
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsappTypes.ts resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsappTypes.ts
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/WhatsappPieces.tsx resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/WhatsappPieces.tsx
Copy-Item resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsappVisualAdapter.ts resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsappVisualAdapter.ts
Copy-Item -Recurse resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsapp-header resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsapp-header
Copy-Item -Recurse resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsapp-bubbles resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsapp-bubbles
Copy-Item -Recurse resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsapp-background resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsapp-background
Copy-Item -Recurse resources/js/evidence-generator/features/preview/designs/mobile-3/whatsapp/whatsapp-footer resources/js/evidence-generator/features/preview/designs/mobile-6/whatsapp/whatsapp-footer
```

No copiar `calls/design-2`, `buildWhatsappConversation.tsx`, `contactIdentityDisplay.ts` ni `conversationReplyRules.ts`: el registry activo usa los renderers neutrales de `shared` para esas responsabilidades.

- [ ] **Step 2: Renombrar símbolos internos de la copia**

Aplicar estos reemplazos únicamente dentro de `mobile-6`:

```text
Mobile1PreviewFrameProps     -> Mobile6PreviewFrameProps
Mobile1PreviewFrame          -> Mobile6PreviewFrame
Mobile1PreviewHeaderProps    -> Mobile6PreviewHeaderProps
Mobile1PreviewHeader         -> Mobile6PreviewHeader
Mobile1PreviewFooter         -> Mobile6PreviewFooter
mobile3WhatsappVisualAdapter -> mobile6WhatsappVisualAdapter
```

Después, comprobar que no quedan nombres ni rutas heredadas:

```powershell
rg -n 'mobile-3|Mobile1Preview|mobile3Whatsapp' resources/js/evidence-generator/features/preview/designs/mobile-6
```

Esperado: sin salida. No modificar ningún archivo dentro de `designs/mobile-3`.

- [ ] **Step 3: Registrar tipos y comportamiento propios**

Extender las uniones exhaustivas:

```ts
export type MobileDesignKey = 'mobile-1' | 'mobile-2' | 'mobile-3' | 'mobile-4' | 'mobile-5' | 'mobile-6';
export type WhatsappDesignVariant = 'mobile-1' | 'mobile-2' | 'mobile-3' | 'mobile-4' | 'mobile-5' | 'mobile-6';
export type SmsDesignVariant = 'mobile-1' | 'mobile-2' | 'mobile-3' | 'mobile-6';
```

Añadir a `whatsappBehaviorProfiles`:

```ts
'mobile-6': 'standard',
```

En `smsAppearance.ts`, antes del fallback final de Mobile 3, añadir una rama exclusiva con una copia literal de su paleta actual:

```ts
if (variant === 'mobile-6') {
    if (themeMode === 'dark') {
        return {
            shell: '#1C2023', header: '#1C2023', conversation: '#101417', receivedBubble: '#1C2023',
            sentBubble: '#014C69', primaryText: '#E0E1E5', sentText: '#E8F5FA', secondaryText: '#BFC0C5',
            headerIcon: '#C0C7CD', headerActionIcon: '#D5DBDF', composer: '#1C2023', tealPoint: '#70B9D1',
            link: '#68B8D0', audioBackground: '#484264', audioIcon: '#E4DDEF', redPoint: '#E9A0A5',
            menuIndicator: '#F3A9B3', statusCheck: '#C8C8CF', readReceiptBackground: '#101417',
            readReceiptForeground: '#E0E1E5', metadataIcon: '#BFC0C5', avatarBackground: '#5CB973',
            avatarForeground: '#202125', systemNavigationForeground: '#ECEDEF', quickReplyBorder: '#68757B',
        };
    }

    return {
        shell: '#E9EEF2', header: '#E9EEF2', conversation: '#F6FAFD', receivedBubble: '#E9EEF2',
        sentBubble: '#00688D', sentText: '#F8FCFF', primaryText: '#202124', secondaryText: '#5F6368',
        headerIcon: '#303438', headerActionIcon: '#303438', composer: '#E9EEF2', tealPoint: '#008C95',
        link: '#147B86', audioBackground: '#E5DEFF', audioIcon: '#28243A', redPoint: '#B3261E',
        menuIndicator: '#B3261E', statusCheck: '#62676B', readReceiptBackground: '#F6FAFD',
        readReceiptForeground: '#62676B', metadataIcon: '#5F6368', avatarBackground: '#49B866',
        avatarForeground: '#FFFFFF', systemNavigationForeground: '#6B6C6E', quickReplyBorder: '#B8C2C8',
    };
}
```

Esta duplicación es intencional: cambiar la rama `mobile-6` posteriormente no altera `mobile-3`.

- [ ] **Step 4: Crear renderer y profile exclusivos**

En `frameRenderers.tsx`, importar `Mobile6PreviewFrame` y añadir:

```tsx
import { Mobile6PreviewFrame } from '../../mobile-6/Mobile6PreviewFrame';

export function renderMobile6Frame({ systemChrome, batteryRenderer, footerRenderer, frame, ...props }: MobileFrameRenderProps) {
    return (
        <Mobile6PreviewFrame
            {...props}
            headerVariant={resolveHeaderVariant(props.channel)}
            footerVariant={props.channel === 'sms' ? 'sms' : 'default'}
            systemHeaderBackground={systemChrome?.headerBackground}
            systemHeaderForeground={systemChrome?.headerForeground}
            systemFooterBackground={systemChrome?.footerBackground}
            systemFooterForeground={systemChrome?.footerForeground}
            batteryRenderer={batteryRenderer}
            footerRenderer={footerRenderer}
            frame={frame}
        />
    );
}
```

Reexportar `renderMobile6Frame` desde `shared/mobile-preview/index.ts`.

En `mobilePreviewProfiles.tsx`, importar el header y adapter de `mobile-6`, crear una familia propia y añadir el profile:

```tsx
export const mobile6WhatsappFamily: ComposedMobileWhatsappProfile = {
    kind: 'composed',
    Header: Mobile6WhatsappHeader,
    behaviorProfile: getWhatsappBehaviorProfile('mobile-6'),
    visualAdapter: mobile6WhatsappVisualAdapter,
};

'mobile-6': {
    key: 'mobile-6',
    renderFrame: renderMobile6Frame,
    whatsapp: mobile6WhatsappFamily,
    sms: { variant: 'mobile-6', showVideoCall: true },
    call: { missedSpacingVariant: 'standard' },
},
```

El profile debe importar:

```tsx
import { WhatsappMobileHeaderUser as Mobile6WhatsappHeader } from './mobile-6/whatsapp/whatsapp-header/WhatsappMobileHeaderUser';
import { mobile6WhatsappVisualAdapter } from './mobile-6/whatsapp/whatsappVisualAdapter';
```

No usar `renderMobile3Frame`, `mobile3WhatsappFamily`, `mobile3WhatsappVisualAdapter` ni `mobile3SmsFamily` dentro de la entrada de `mobile-6`.

### Task 3: Añadir catálogo y migración Laravel

**Files:**

- Modify: `app/Support/MobileDesignCatalog.php`
- Create: `database/migrations/2026_09_08_000000_add_mobile_6_to_mobile_designs_table.php`

- [ ] **Step 1: Añadir Mobile 6 al catálogo canónico**

Después de `mobile-5` en `MobileDesignCatalog::available()`, añadir:

```php
[
    'key' => 'mobile-6',
    'label' => 'Mobile 6',
    'status' => 'development',
],
```

`MobileDesignSeeder` no necesita cambios porque ya recorre `MobileDesignCatalog::keys()`.

- [ ] **Step 2: Generar y completar la migración reversible**

```powershell
php artisan make:migration add_mobile_6_to_mobile_designs_table --no-interaction
```

Usar el timestamp generado por Artisan; si coincide con otro archivo, conservar el timestamp único generado. El contenido debe ser:

```php
<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-6',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        MobileDesign::query()->where('design_key', 'mobile-6')->delete();
    }
};
```

Esto sigue el patrón ya usado por las migraciones de `mobile-4` y `mobile-5`.

### Task 4: Congelar paridad y verificar

**Files:**

- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-preview-visual-baseline.json`

- [ ] **Step 1: Generar únicamente las seis entradas nuevas del contrato visual**

Ejecutar la suite con el modo de actualización después de revisar que `git diff -- designs/mobile-3` esté vacío:

```powershell
$env:UPDATE_MOBILE_VISUAL_BASELINE='1'
node --test resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts
Remove-Item Env:UPDATE_MOBILE_VISUAL_BASELINE
```

Revisar que el JSON conserve las 30 entradas anteriores sin cambiar sus hashes y añada exactamente:

```text
mobile-6/whatsapp/light
mobile-6/whatsapp/dark
mobile-6/sms/light
mobile-6/sms/dark
mobile-6/call/light
mobile-6/call/dark
```

- [ ] **Step 2: Formatear PHP y ejecutar la verificación mínima completa**

```powershell
vendor/bin/pint --dirty --format agent
node --test resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts
pnpm.cmd exec tsc --noEmit
php artisan test --compact tests/Feature/DashboardTest.php tests/Feature/MobileDesignRegistrationTest.php tests/Feature/MobileDesignSeederTest.php
git diff --check
```

Esperado: todos los comandos terminan con código `0`.

- [ ] **Step 3: Auditar aislamiento y alcance**

```powershell
rg -n 'mobile-3|Mobile1Preview|mobile3Whatsapp' resources/js/evidence-generator/features/preview/designs/mobile-6
git diff --name-only -- resources/js/evidence-generator/features/preview/designs/mobile-3
git status --short
git diff --stat
```

Esperado: los dos primeros comandos no muestran archivos ni coincidencias. El estado solo contiene los archivos enumerados en este plan y la migración con timestamp generada por Artisan.

- [ ] **Step 4: Commit único de la funcionalidad**

```powershell
git add app/Support/MobileDesignCatalog.php database/migrations resources/js/evidence-generator/types.ts resources/js/evidence-generator/features/preview/designs/mobile-6 resources/js/evidence-generator/features/preview/designs/mobilePreviewProfiles.tsx resources/js/evidence-generator/features/preview/designs/mobile-preview-visual-baseline.json resources/js/evidence-generator/features/preview/designs/MobilePreviewVisualParity.test.ts resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts resources/js/evidence-generator/features/preview/designs/shared/mobile-preview resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappTypes.ts resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappProfiles.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsTypes.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsAppearance.ts tests/Feature/DashboardTest.php tests/Feature/MobileDesignRegistrationTest.php
git commit -m "feat: add independent mobile 6 preview"
```

## Criterios de aceptación

- `mobile-6` aparece después de `mobile-5` y puede registrarse mediante la API existente.
- La migración crea `mobile-6` idempotentemente y `down()` elimina únicamente esa clave.
- WhatsApp, SMS y llamadas renderizan en tema claro y oscuro.
- La apariencia inicial coincide con `mobile-3`, salvo contenido variable derivado deliberadamente de la clave propia de notificaciones.
- Ningún archivo bajo `designs/mobile-6` importa o menciona `mobile-3`.
- El profile de `mobile-6` usa su propio renderer, header, adapter y variante SMS.
- No cambia ningún archivo de `designs/mobile-3`.
- No se crean archivos de prueba nuevos; se amplían dos suites frontend y dos pruebas Pest existentes.
