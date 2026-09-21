# Mobile 12 Independent Mobile 3 Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear `mobile-12` como un diseño seleccionable y completamente autónomo que replique visualmente `mobile-3` en WhatsApp, SMS y llamadas, salvo los iconos de cámara, teléfono y tres puntos de la cabecera de WhatsApp, cuya geometría debe replicar localmente la de `mobile-10`.

**Architecture:** Usar `mobile-10` únicamente como plantilla de organización para que `mobile-12` tenga frame, chrome del dispositivo y previews locales por canal. Tras el copiado mecánico, sustituir su presentación por los valores y composición visual de `mobile-3`, sin importar ningún archivo desde carpetas `mobile-*`; solo se permiten dependencias de `designs/shared`, módulos generales del generador y paquetes instalados. Registrar la nueva clave en el registry TypeScript y en el catálogo Laravel mediante una migración nueva.

**Tech Stack:** Laravel 12, PHP 8.2+, Inertia React 2, React 19, TypeScript, Tailwind CSS 4, Pest 3 y Node test runner.

---

## Decisiones cerradas

- Alcance visual: WhatsApp, SMS y llamadas; temas claro y oscuro; frame, barra de estado y navegación inferior incluidos.
- Fuente estructural: `resources/js/evidence-generator/features/preview/designs/mobile-10/`.
- Fuente visual: perfil y archivos de `mobile-3`, incluyendo dimensiones `487.5px × 950px`, tipografía, colores, espaciado, fondos, burbujas, composer, SMS, llamadas y chrome del dispositivo.
- Excepción visual: en `mobile-12` la cabecera de WhatsApp conserva el orden cámara → teléfono → tres puntos y replica los `path`, `viewBox`, tamaño y separación actuales de `mobile-10`.
- Aislamiento: ningún `.ts`, `.tsx` o `.css` dentro de `mobile-12` puede importar desde `mobile-1` a `mobile-11`. Los SVG/iconos necesarios deben existir dentro de `mobile-12` o estar escritos inline allí.
- No se agregan dependencias, no se modifican diseños existentes y no se amplía el alcance a refactors del registry.
- Estrategia mínima de pruebas: un solo archivo Node nuevo para el contrato frontend; se actualizan únicamente dos pruebas Pest existentes con listas cerradas. TypeScript y Vite cubren resolución de imports/compilación.

## Mapa de archivos

**Crear como árbol local de `mobile-12`, siguiendo la organización de `mobile-10` y renombrando todos los símbolos `Mobile10`/`mobile10` a `Mobile12`/`mobile12`:**

- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12PreviewFrame.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12PreviewHeader.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12PreviewFooter.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12BatteryIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12NotificationIcons.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12WifiIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/mobile12Colors.ts`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/mobile12.css`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/components/navigation/Mobile12BackIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/components/navigation/Mobile12HomeIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/components/navigation/Mobile12RecentsIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/components/status-bar/Mobile12CellSignalIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/components/status-bar/Mobile12WifiIcon.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/calls/IncomingCallContent.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/calls/PreviewMobile12Call.tsx`
- `resources/js/evidence-generator/features/preview/designs/mobile-12/sms/**` con los mismos archivos y subdirectorios de `mobile-10/sms`, cambiando cualquier nombre `Mobile10*` por `Mobile12*`.
- `resources/js/evidence-generator/features/preview/designs/mobile-12/whatsapp/**` con los mismos archivos y subdirectorios de `mobile-10/whatsapp`, incluyendo `whatsapp-header/Mobile12MoreVerticalIcon.tsx` y cambiando cualquier nombre `Mobile10*` por `Mobile12*`.
- `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12Preview.test.ts`.

No copiar `mobile-10/components/icons/*.png` si la implementación final no los consume: el chrome debe dibujarse localmente como `mobile-3`, y no deben quedar recursos de `mobile-10` sin uso.

**Modificar para registro frontend:**

- `resources/js/evidence-generator/types.ts`
- `resources/js/evidence-generator/features/preview/designs/mobilePreviewProfiles.tsx`
- `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/frameRenderers.tsx`
- `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/index.ts`
- `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappProfiles.ts`
- `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappTypes.ts`

**Crear/modificar para registro backend:**

- Crear con Artisan: `database/migrations/*_add_mobile_12_to_mobile_designs_table.php`
- Modificar: `app/Support/MobileDesignCatalog.php`
- Modificar: `tests/Feature/DashboardTest.php`
- Modificar: `tests/Feature/MobileDesignRegistrationTest.php`

---

### Task 1: Crear y registrar el frontend autónomo de mobile-12

**Files:** todos los archivos frontend enumerados en el mapa anterior.

- [ ] **Step 1: Crear primero la única prueba contractual frontend**

Crear `resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12Preview.test.ts` con cuatro contratos en el mismo archivo:

1. existen frame, header, footer y los previews locales de WhatsApp, SMS y llamada;
2. un recorrido recursivo de los `.ts`, `.tsx` y `.css` de `mobile-12` no encuentra imports hacia `mobile-(1..11)`;
3. registry y unión `MobileDesignKey` contienen `mobile-12` y apuntan a `renderMobile12Frame`, `PreviewMobile12Whatsapp`, `PreviewMobile12Sms` y `PreviewMobile12Call`;
4. los colores SMS claro/oscuro coinciden con `getSmsColors(theme, 'mobile-3')`, mientras la cabecera WhatsApp contiene `Mobile12MoreVerticalIcon` y las firmas SVG actuales de cámara/teléfono de `mobile-10`.

La comprobación de aislamiento debe revisar todo el árbol, no solo la cabecera. Usar como patrón prohibido:

```ts
/from\s+['"][^'"]*mobile-(?:[1-9]|10|11)(?:\/|['"])/
```

Las firmas mínimas de los iconos excepcionales son:

```ts
assert.match(headerSource, /viewBox="0 -4 22 22"/);
assert.match(headerSource, /M4 20C3\.45 20[\s\S]*H4ZM4 18H16V6H4V18Z/);
assert.match(headerSource, /viewBox="-2 -2 22 26"/);
assert.match(headerSource, /M19\.95 21C17\.8667 21[\s\S]*L14\.975 17\.95Z/);
assert.match(headerSource, /Mobile12MoreVerticalIcon/);
```

- [ ] **Step 2: Ejecutar la prueba para confirmar el estado rojo**

Run:

```powershell
node --test --experimental-strip-types resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12Preview.test.ts
```

Expected: FAIL porque todavía faltan los archivos y registros de `mobile-12`.

- [ ] **Step 3: Crear el árbol local usando mobile-10 solo como plantilla estructural**

Como el directorio `mobile-12` ya contiene la prueba del Step 1, copiar dentro de él todos los archivos de producción de `mobile-10`, excluyendo `Mobile10Preview.test.ts`; no crear `mobile-12/mobile-10` ni sobrescribir `Mobile12Preview.test.ts`. Dentro de los archivos copiados hacer el reemplazo mecánico y exclusivo:

```text
Mobile10  -> Mobile12
mobile10  -> mobile12
mobile-10 -> mobile-12
```

Renombrar también los nombres de archivo que contienen `Mobile10` o `mobile10`. No modificar `mobile-10` y no dejar referencias textuales accidentales a `mobile-10` dentro de `mobile-12`.

- [ ] **Step 4: Sustituir la apariencia copiada por una réplica local de mobile-3**

Aplicar esta matriz sin crear imports hacia `mobile-3`:

| Área local de mobile-12 | Referencia visual que se debe transcribir | Resultado requerido |
|---|---|---|
| `Mobile12PreviewFrame/Header/Footer.tsx`, `mobile12Colors.ts`, `mobile12.css`, `components/navigation/*`, `components/status-bar/*`, batería y notificaciones | `mobile-3/Mobile1PreviewFrame.tsx`, `Mobile1PreviewHeader.tsx`, `Mobile1PreviewFooter.tsx` | Mismas dimensiones, fondos, sombras, tipografía, barra de estado y navegación inferior de mobile-3, con símbolos Mobile12 locales. |
| `whatsapp/*` | `mobile-3/whatsapp/*` y el perfil `mobile3WhatsappFamily` | Mismos fondos, colores, avatar, burbujas, metadata, indicadores, composer y comportamiento `standard`; mantener el layout local completo usado por los móviles recientes. |
| `sms/*` | `mobile3SmsFamily` y `designs/shared/sms` con variante `mobile-3` | Preview local completo con `showVideoCall: true`, colores copiados a `getMobile12SmsColors()` y sin pasar `mobile-3` en runtime. |
| `calls/*` | perfil de llamada de `mobile-3` (`missedSpacingVariant: 'standard'`) | Preview local de llamada con el frame/chrome Mobile12 y espaciado estándar. |

Conservar utilidades compartidas neutrales (`designs/shared`, `mobileNotifications`, tipos globales). No reutilizar componentes, iconos, CSS ni assets desde una carpeta de otro mobile.

En `whatsapp/whatsapp-header/WhatsappMobileHeaderUser.tsx`, después de igualar layout, avatar, texto y colores con `mobile-3`, reemplazar exclusivamente las tres acciones derechas por copias locales de la implementación actual de `mobile-10`:

- cámara: mismo `path`, `viewBox="0 -4 22 22"`, `height="26"`, `width="23"`;
- teléfono: mismo `path`, `viewBox="-2 -2 22 26"`, `height="30"`, `width="22"`;
- menú: componente local `Mobile12MoreVerticalIcon`, con la geometría de `Mobile10MoreVerticalIcon` y sin importarlo;
- contenedor: mismo orden y `gap-[22.5px]` de `mobile-10`.

- [ ] **Step 5: Registrar mobile-12 en los mapas compartidos**

Aplicar exactamente estos cambios lógicos:

```ts
// resources/js/evidence-generator/types.ts
export type MobileDesignKey =
    | 'mobile-1'
    | 'mobile-2'
    | 'mobile-3'
    | 'mobile-4'
    | 'mobile-5'
    | 'mobile-6'
    | 'mobile-7'
    | 'mobile-8'
    | 'mobile-9'
    | 'mobile-10'
    | 'mobile-11'
    | 'mobile-12';

// shared/whatsapp/whatsappTypes.ts
export type WhatsappDesignVariant =
    | 'mobile-1'
    | 'mobile-2'
    | 'mobile-3'
    | 'mobile-4'
    | 'mobile-5'
    | 'mobile-6'
    | 'mobile-7'
    | 'mobile-8'
    | 'mobile-9'
    | 'mobile-10'
    | 'mobile-11'
    | 'mobile-12';

// shared/whatsapp/whatsappProfiles.ts
'mobile-12': 'standard',
```

En `frameRenderers.tsx`, importar `Mobile12PreviewFrame` y exportar `renderMobile12Frame` con el mismo contrato de canal de `renderMobile3Frame`, pero renderizando únicamente el frame local Mobile12. Reexportarlo desde `shared/mobile-preview/index.ts`.

En `mobilePreviewProfiles.tsx`, importar los tres previews locales y registrar:

```tsx
'mobile-12': {
    key: 'mobile-12',
    renderFrame: renderMobile12Frame,
    whatsapp: { kind: 'custom', Preview: PreviewMobile12Whatsapp },
    sms: { kind: 'custom', Preview: PreviewMobile12Sms },
    call: { kind: 'custom', Preview: PreviewMobile12Call },
},
```

No añadir `mobile-12` a `SmsDesignVariant` ni a `shared/sms/smsAppearance.ts` si el preview local no los usa; `getMobile12SmsColors()` debe contener su paleta propia para conservar aislamiento.

- [ ] **Step 6: Ejecutar el contrato frontend**

Run:

```powershell
node --test --experimental-strip-types resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12Preview.test.ts
```

Expected: PASS, cuatro contratos aprobados.

---

### Task 2: Registrar mobile-12 en Laravel y verificar el cambio completo

**Files:** migración, catálogo y dos pruebas Feature enumeradas arriba.

- [ ] **Step 1: Actualizar las expectativas backend antes de implementar**

En `DashboardTest.php` y en la expectativa `globalMobileDesigns` de `MobileDesignRegistrationTest.php`, añadir `mobile-12` al final:

```php
['mobile-1', 'mobile-2', 'mobile-3', 'mobile-4', 'mobile-5', 'mobile-6', 'mobile-7', 'mobile-8', 'mobile-9', 'mobile-10', 'mobile-11', 'mobile-12']
```

Run:

```powershell
php artisan test --compact tests/Feature/DashboardTest.php tests/Feature/MobileDesignRegistrationTest.php
```

Expected: FAIL porque `MobileDesignCatalog` todavía no expone `mobile-12`.

- [ ] **Step 2: Crear la migración con Artisan y registrar el catálogo**

Run:

```powershell
php artisan make:migration add_mobile_12_to_mobile_designs_table --no-interaction
```

Completar el archivo generado siguiendo la migración de `mobile-11`:

```php
<?php

use App\Models\MobileDesign;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        MobileDesign::query()->firstOrCreate([
            'design_key' => 'mobile-12',
        ]);
    }

    public function down(): void
    {
        if (MobileDesign::query()->where('design_key', 'mobile-12')->exists()) {
            throw new RuntimeException('Cannot roll back mobile-12 while existing records use it.');
        }
    }
};
```

Agregar al final de `MobileDesignCatalog::available()`:

```php
[
    'key' => 'mobile-12',
    'label' => 'Mobile 12',
    'status' => 'development',
],
```

- [ ] **Step 3: Ejecutar la verificación mínima afectada**

Run, en este orden:

```powershell
node --test --experimental-strip-types resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12Preview.test.ts
php artisan test --compact tests/Feature/DashboardTest.php tests/Feature/MobileDesignRegistrationTest.php
vendor/bin/pint --dirty --format agent
npx tsc --noEmit
npm run build
```

Expected: todos los comandos terminan con código `0`; Pint puede reformatear la migración/catálogo y, si lo hace, se vuelven a ejecutar las dos pruebas Pest.

- [ ] **Step 4: Auditar aislamiento y paridad visual**

Run:

```powershell
rg -n "from\s+['\"][^'\"]*mobile-(1|2|3|4|5|6|7|8|9|10|11)(/|['\"])" resources/js/evidence-generator/features/preview/designs/mobile-12
rg -n "Mobile10|mobile10|mobile-10|Mobile3|mobile3|mobile-3" resources/js/evidence-generator/features/preview/designs/mobile-12
```

Expected: la primera búsqueda no devuelve coincidencias. La segunda puede devolver únicamente referencias de comparación dentro de `Mobile12Preview.test.ts`; ningún archivo de producción puede contener nombres o rutas de `mobile-3` o `mobile-10`.

Con el servidor de desarrollo activo, resolver `/inicio` mediante Laravel Boost `get-absolute-url` y comparar `mobile-12` contra `mobile-3` en los seis estados: tres canales × claro/oscuro. Aceptar únicamente si frame, chrome, contenido, espaciado y colores coinciden visualmente, y si en WhatsApp las únicas diferencias son cámara, teléfono y tres puntos según `mobile-10`. Verificar además que no exista scroll horizontal y que los controles conserven sus etiquetas accesibles.

- [ ] **Step 5: Revisar el diff final**

Confirmar que:

- no cambió ningún archivo dentro de `mobile-3`, `mobile-10` o `mobile-11`;
- no se agregaron dependencias;
- la migración es nueva y fue creada por Artisan;
- `mobile-12` aparece al final del catálogo y del registry;
- el único archivo de prueba nuevo es `Mobile12Preview.test.ts`;
- no quedaron PNG, CSS, imports o símbolos copiados de `mobile-10` sin uso.
