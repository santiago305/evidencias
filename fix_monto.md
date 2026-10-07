# fix_monto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to follow the checklist. No commit is part of this plan.

**Goal:** In every conversation, show `monto` exactly as entered, removing only whitespace. Thus `12,0` stays `12,0` and `1 2000,00` becomes `12000,00`.

**Architecture:** Keep the form, request validation, and stored `input_data.monto` unchanged. Normalize only when constructing conversation text. Both `{monto}` and `{monto_formateado}` will use the same visible value; the local WhatsApp fallback must follow the same rule. Do not alter `cuota` formatting.

**Tech Stack:** Laravel 12, PHP 8, Pest 3, React 19, TypeScript.

---

## Fase única: conservar el monto literal en la conversación

**Archivos:**

- Modificar `app/Services/Conversation/ConversationRenderService.php` (`buildVariables`, líneas aproximadas 278-294; retirar `formatFlexibleAmount`, líneas 408-420).
- Modificar `resources/js/evidence-generator/lib/whatsapp/format.ts` (añadir función exclusiva para `monto`; conservar `formatMoneyValue` para `cuota`).
- Modificar `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/buildWhatsappConversation.tsx` (línea aproximada 128).
- Modificar `resources/js/evidence-generator/features/preview/designs/whatsapp-desktop/buildWhatsappConversation.tsx` (línea aproximada 126).
- Modificar `tests/Feature/EvidenceGenerationTest.php` (pruebas existentes de `monto`, líneas aproximadas 638-673).
- Crear `resources/js/evidence-generator/lib/whatsapp/format.test.ts`.

- [ ] **1. Escribir las pruebas antes del cambio.** En `EvidenceGenerationTest.php`, actualizar las dos expectativas de enteros: `99999` debe producir `Monto S/99999` y `3250` debe producir `Monto S/3250`; cambiar los nombres de esas pruebas para describir la conservación literal. Añadir una prueba de integración con una conversación de una línea: `Monto S/{monto}; detalle S/{monto_formateado}`. Para cada par siguiente, enviar `monto` al endpoint y comprobar ambos placeholders y el valor original en `GeneratedEvidence::input_data['monto']`:

  | Entrada | Valor visible en ambos placeholders |
  |---|---|
  | `1500` | `1500` |
  | `1500.50` | `1500.50` |
  | `1500.75` | `1500.75` |
  | `1500,50` | `1500,50` |
  | `1500,75` | `1500,75` |
  | `12,0` | `12,0` |
  | `1 2000,00` | `12000,00` |

  Usar `createConversationForTest()` y `evidencePayload()` ya definidos en ese archivo. El caso PHP nuevo debe llamarse `generate evidence preserves amount placeholders literally except whitespace` y seguir este patrón:

  ```php
  $user = User::factory()->create();
  createConversationForTest('conv_monto_literal_001', [
      ['side' => 'out', 'delay_minutes' => 0, 'lines' => ['Monto S/{monto}; detalle S/{monto_formateado}']],
  ]);

  foreach ([
      ['1500', '1500'],
      ['1500.50', '1500.50'],
      ['1500.75', '1500.75'],
      ['1500,50', '1500,50'],
      ['1500,75', '1500,75'],
      ['12,0', '12,0'],
      ['1 2000,00', '12000,00'],
  ] as [$input, $expected]) {
      $response = $this->actingAs($user)->postJson(route('evidences.generate'), [
          ...evidencePayload(),
          'conversationCode' => 'conv_monto_literal_001',
          'monto' => $input,
      ]);

      $response->assertOk()->assertJsonPath('messages.0.lines.0', "Monto S/{$expected}; detalle S/{$expected}");
      $evidence = GeneratedEvidence::query()->where('seed_code', $response->json('seedCode'))->firstOrFail();
      expect($evidence->input_data['monto'])->toBe($input);
  }
  ```

  En `format.test.ts`, comprobar la misma tabla para `stripAmountWhitespace()` con `node:test` y `node:assert/strict`, incluyendo `1\u00A02000,00` → `12000,00` para cubrir espacio no separable:

  ```ts
  import assert from 'node:assert/strict';
  import test from 'node:test';
  import { stripAmountWhitespace } from './format.ts';

  test('conversation amount keeps every character except whitespace', () => {
      for (const [input, expected] of [
          ['1500', '1500'],
          ['1500.50', '1500.50'],
          ['1500.75', '1500.75'],
          ['1500,50', '1500,50'],
          ['1500,75', '1500,75'],
          ['12,0', '12,0'],
          ['1 2000,00', '12000,00'],
          ['1\u00A02000,00', '12000,00'],
      ]) {
          assert.equal(stripAmountWhitespace(input), expected);
      }
  });
  ```

  La prueba PHP comprueba además que `input_data.monto` conserva `1 2000,00` con su espacio original.

- [ ] **2. Confirmar que las pruebas detectan el problema actual.** Ejecutar `php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter=amount` y `node --experimental-strip-types --test resources/js/evidence-generator/lib/whatsapp/format.test.ts`. Esperado antes del cambio: fallan los casos nuevos de representación literal; la prueba TypeScript puede fallar porque todavía no existe el export `stripAmountWhitespace`.

- [ ] **3. Cambiar únicamente la representación de conversación.** En `ConversationRenderService::buildVariables()`, sustituir la asignación de `$monto` y las dos entradas del arreglo por:

  ```php
  $monto = (string) preg_replace('/[\s\p{Z}]+/u', '', (string) ($input['monto'] ?? ''));

  'monto' => $monto,
  'monto_formateado' => $monto,
  ```

  Retirar `formatFlexibleAmount()` al quedar sin uso. Conservar `formatMoney()` porque sigue atendiendo `cuota_formateada`. No modificar el request, `EvidenceGeneratorService`, el modelo, la migración ni el formulario; el texto original debe seguir guardándose en `input_data`.

  En `format.ts`, añadir sin cambiar `formatMoneyValue()`:

  ```ts
  export function stripAmountWhitespace(value: string): string {
      return value.replace(/[\s\p{Z}]+/gu, '');
  }
  ```

  En los dos `buildWhatsappConversation.tsx`, importar `stripAmountWhitespace` desde la misma ruta donde ya se importa `formatMoneyValue`, sustituir solo el cálculo de `formattedMonto` por el siguiente y eliminar `useThousandsMonto` porque dejará de utilizarse:

  ```ts
  const formattedMonto = data.monto?.trim() ? stripAmountWhitespace(data.monto) : null;
  ```

  Mantener el cálculo de `formattedCuota` y el resto del constructor de mensajes. `buildWhatsappTemplateValues()` ya entrega `formattedMonto` a ambos placeholders locales, por lo que no necesita modificación.

- [ ] **4. Verificar y revisar el diff.** Ejecutar `vendor/bin/pint --dirty --format agent` para los PHP modificados; después, `php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter=amount` y `node --experimental-strip-types --test resources/js/evidence-generator/lib/whatsapp/format.test.ts`. Confirmar los resultados de la tabla, incluidos `12,0` y `1 2000,00`; comprobar que los enteros permanecen literales y que la cuota conserva su formato anterior. Revisar `git diff --check`, `git diff` y `git status --short` para confirmar que no hubo cambios en entrada, validación, almacenamiento ni estilos. No hacer commit.

**Criterio de aceptación:** El valor escrito solo pierde caracteres de espacio al aparecer en cualquier conversación; puntos, comas, ceros finales y demás caracteres permanecen en el mismo orden. El valor guardado en `input_data.monto` permanece idéntico al enviado.
