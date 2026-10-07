# Sexo y fecha de nacimiento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. La ejecución es inline y no incluye crear commits.

**Objetivo:** agregar `sexo` y `fecha_nacimiento` al formulario y al JSON de cada evidencia; resolver `{s_cliente(cliente)}` y `{fecha_nacimiento}` en la conversación.

**Arquitectura:** el formulario conserva `sexo` como `M`, `F` o `''` y `fecha_nacimiento` como `YYYY-MM-DD`. El backend valida y guarda ambos en `generated_evidences.input_data`; el renderizador transforma únicamente el tratamiento del cliente y la fecha visibles. La vista previa local de WhatsApp usa las mismas reglas. No se crea `{sexo}` ni se agregan columnas. La lógica existente del asesor queda fuera de este cambio.

**Tecnología:** Laravel 12, PHP 8.2, Pest 3, React 19, TypeScript, Inertia 2, Tailwind 4.

## Contrato de aceptación

| `sexo` guardado | `{s_cliente(cliente)}` |
|---|---|
| `M` | `Sr` |
| `F` | `Sra` |
| `''`, `null` o clave ausente | `Sr/a` |

- El select muestra exactamente `M`, `F` y `Vacío`; `Vacío` equivale a `''` en el estado y en el JSON.
- `fecha_nacimiento = '1995-08-21'` se guarda así y `{fecha_nacimiento}` muestra `21/08/1995`. Si la fecha está vacía o falta en una evidencia antigua, la variable muestra `''`.
- Un monto que solo contenga dígitos, como `100`, se muestra como `100.00`; los montos que ya traen decimales conservan su escritura, quitando únicamente espacios.
- El input de monto usa `inputMode="decimal"` para mostrar un teclado decimal y conservar el texto ingresado, incluidos punto y coma.
- La fecha es opcional, válida en formato `YYYY-MM-DD` y no posterior a hoy. Una fecha inválida o futura recibe HTTP 422.
- Al reanudar una evidencia, elegir `Vacío` debe reemplazar un `sexo` anterior; quitar la fecha también debe reemplazar una fecha anterior. Ambos cambios deben quedar en `input_data` para futuras reanudaciones.
- El select del formulario controla únicamente el nuevo tratamiento del cliente. No hay cambios en la lógica del asesor.
- Las conversaciones que ya contienen `Sr(a)` literal conservan ese texto hasta que alguien edite la plantilla y coloque el nuevo placeholder.

## Fase única: datos, renderizado y comprobación

### 1. Preparar pruebas que fijen el contrato

**Archivos:** `tests/Feature/EvidenceGenerationTest.php`, `resources/js/evidence-generator/lib/formState.test.ts`, `resources/js/evidence-generator/lib/replayForm.test.ts`, `resources/js/evidence-generator/features/conversations/conversationVariables.test.ts`; crear `resources/js/evidence-generator/lib/whatsapp/templates.test.ts` dentro del directorio existente.

- [ ] Añadir a `EvidenceGenerationTest.php` una prueba de integración con una conversación cuya línea sea `Trato {s_cliente(cliente)}; nacimiento {fecha_nacimiento}`. Usar `createConversationForTest()` y `evidencePayload()` existentes. Para cada fila, enviar `postJson(route('evidences.generate'), [...evidencePayload(), 'conversationCode' => $code, 'sexo' => $sexo, 'fecha_nacimiento' => '1995-08-21'])`, comprobar `messages.0.lines.0` y comprobar que `GeneratedEvidence::input_data` conserve `sexo` y la fecha originales:

  | `sexo` enviado | Línea esperada |
  |---|---|
  | `M` | `Trato Sr; nacimiento 21/08/1995` |
  | `F` | `Trato Sra; nacimiento 21/08/1995` |
  | `''` | `Trato Sr/a; nacimiento 21/08/1995` |

- [ ] Añadir una prueba con ambos campos omitidos y plantilla `Trato {s_cliente(cliente)}; nacimiento [{fecha_nacimiento}]`. Esperado: `Trato Sr/a; nacimiento []`.
- [ ] Añadir pruebas de HTTP 422 para `sexo = 'X'`, `fecha_nacimiento = '21/08/1995'`, `fecha_nacimiento = '1995-02-30'` y una fecha posterior a hoy. Usar `Carbon::setTestNow()` en el caso de futuro y restaurarlo como ya hace el archivo.
- [ ] Añadir una prueba de reanudación: generar una evidencia con `sexo = 'M'` y fecha `1995-08-21`; repetir con su `seedCode`, `sexo = ''` y `fecha_nacimiento = ''`. Verificar el texto `Sr/a`, la fecha visible vacía y las dos cadenas vacías en `input_data` después de recargar el modelo.
- [ ] En las pruebas TypeScript, exigir `sexo: ''` y `fecha_nacimiento: ''` en el estado inicial; su limpieza e hidratación al reanudar; los placeholders `{s_cliente(cliente)}` y `{fecha_nacimiento}` en el selector; y las tres filas de la tabla de tratamiento en el renderizador local. Probar asimismo la fecha con ceros (`2001-02-03` → `03/02/2001`).
- [ ] Ejecutar primero las pruebas nuevas y confirmar que detectan la funcionalidad ausente: `php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter=sexo` y `node --experimental-strip-types --test resources/js/evidence-generator/lib/formState.test.ts resources/js/evidence-generator/lib/replayForm.test.ts resources/js/evidence-generator/features/conversations/conversationVariables.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts`. Es esperado que fallen antes de la implementación.

### 2. Incorporar los campos en el formulario y en la reanudación

**Archivos:** `resources/js/evidence-generator/types.ts`, `resources/js/evidence-generator/lib/formState.ts`, `resources/js/evidence-generator/features/editor/components/DataForm.tsx`, `resources/js/evidence-generator/features/editor/components/FormPanel.tsx`, `resources/js/evidence-generator/App.tsx`, `resources/js/evidence-generator/lib/replayForm.ts`.

- [ ] Agregar `sexo: string` y `fecha_nacimiento: string` a `FormState`, e inicializarlos como `''` en `createInitialFormState()`. `SavedData` los recibe automáticamente porque extiende `FormState`; `App.tsx` los incluirá automáticamente en `FormData` al recorrer el estado.
- [ ] Configurar el monto como input de texto con `inputMode="decimal"`. `type="decimal"` no existe en HTML; mantener texto conserva punto o coma y deja que el renderizador añada `.00` solo a enteros.
- [ ] En `DataForm`, agregar el select y reutilizar `Input` para la fecha. Mantener el diseño de los campos vecinos y usar esta conexión exacta con el estado:

  ```tsx
  <label className="block">
      <span className="text-xs font-semibold text-slate-700">Sexo</span>
      <select
          id="sexo"
          value={form.sexo}
          onChange={onChange('sexo')}
          className="mt-1 w-full rounded-sm border border-slate-200 bg-white p-2 text-xs text-slate-900"
      >
          <option value="M">M</option>
          <option value="F">F</option>
          <option value="">Vacío</option>
      </select>
  </label>
  <Input
      label="Fecha de nacimiento"
      id="fecha_nacimiento"
      type="date"
      value={form.fecha_nacimiento}
      onChange={onChange('fecha_nacimiento')}
  />
  ```
- [ ] Ampliar el tipo de `onChange` en `DataForm`, `FormPanel` y `App` para aceptar `ChangeEvent<HTMLInputElement | HTMLSelectElement>`. Reutilizar `handleChange('sexo')` y `handleChange('fecha_nacimiento')`: la rama genérica ya conserva `e.target.value` como string. No aplicar la limpieza de DNI, teléfono ni duración a estos campos. `InputProps` mantiene su evento de input porque el handler ampliado acepta también `HTMLInputElement`.
- [ ] Incluir ambos nombres en `replayHydratedFields` y en `clearReplayHydratedForm()`. `hydrateReplayForm()` debe devolver `''` cuando las claves no existan y conservar cualquier string válido recibido; si se tipa `sexo` como unión en lugar de `string`, validar la unión antes de asignar.

### 3. Validar y persistir los dos valores

**Archivos:** `app/Http/Requests/GenerateEvidenceRequest.php`, `app/Http/Controllers/EvidenceController.php`, `app/Services/Evidence/EvidenceGeneratorService.php`.

- [ ] Tras consultar `search-docs` para validación de Laravel 12, añadir a `GenerateEvidenceRequest::rules()` estas reglas, siguiendo el patrón de arrays del archivo:

  ```php
  'sexo' => ['sometimes', 'nullable', 'string', Rule::in(['M', 'F'])],
  'fecha_nacimiento' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
  ```

- [ ] En `EvidenceController::generate()`, después de `$validated = $request->validated()`, normalizar a `''` solo las claves que realmente estén presentes. Laravel puede convertir un campo de formulario vacío en `null`; la distinción entre clave ausente y clave enviada vacía es necesaria para la reanudación:

  ```php
  foreach (['sexo', 'fecha_nacimiento'] as $field) {
      if (array_key_exists($field, $validated)) {
          $validated[$field] = (string) ($validated[$field] ?? '');
      }
  }
  ```

- [ ] En la rama de reanudación de `EvidenceGeneratorService::generate()`, después del filtro actual que descarta `null` y `''`, reincorporar únicamente estos dos campos si estaban presentes en `$input`:

  ```php
  foreach (['sexo', 'fecha_nacimiento'] as $field) {
      if (array_key_exists($field, $input)) {
          $editableInput[$field] = (string) ($input[$field] ?? '');
      }
  }
  ```

- [ ] En esa misma rama, sustituir el bloque que hoy solo guarda `TCEA` por el siguiente. Conservar la semántica actual de `TCEA`: si llega vacío, el filtro no lo incluye. No ampliar la persistencia al resto de los campos de reanudación:

  ```php
  $persistedInput = array_intersect_key(
      $editableInput,
      array_flip(['TCEA', 'sexo', 'fecha_nacimiento']),
  );

  if ($persistedInput !== []) {
      $replayEvidence->input_data = [
          ...$storedInput,
          ...$persistedInput,
      ];
      $replayEvidence->save();
  }
  ```
- [ ] No crear migración: `generated_evidences.input_data` ya es JSON y `GeneratedEvidence` lo castea a `array`. La generación normal guarda `$renderInput` completo.

### 4. Resolver las variables en el backend y exponerlas en el editor

**Archivos:** `app/Services/Conversation/ConversationRenderService.php`, `resources/js/evidence-generator/features/conversations/conversationVariables.ts`.

- [ ] En `buildVariables()`, guardar el resultado visible bajo la clave especial `cliente(cliente)`: `M => 'Sr'`, `F => 'Sra'`, y ausente o vacío => `'Sr/a'`. La clave incluye paréntesis para que el reemplazo genérico de `{clave}` no exponga el sexo original. Añadir `fecha_nacimiento` ya formateada para presentación. No agregar `{sexo}` ni `{sexo_cliente}`.
- [ ] Formatear la fecha sin aplicar zona horaria: si el valor es una cadena ISO válida, convertirla a `d/m/Y`; si falta o es inválida en datos antiguos, devolver `''`. Un helper concreto y seguro es:

  ```php
  private function formatBirthDate(mixed $value): string
  {
      if (! is_string($value) || $value === '') {
          return '';
      }

      $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $value);

      return $date !== false && $date->format('Y-m-d') === $value
          ? $date->format('d/m/Y')
          : '';
  }
  ```

- [ ] Antes del reemplazo genérico de `{clave}`, sustituir exactamente `{s_cliente(cliente)}` con el valor de `$variables['cliente(cliente)']` y usar `Sr/a` como respaldo. No implementar una transformación genérica de cualquier palabra dentro de `s_cliente(...)` porque el contrato solo define `cliente`.
- [ ] En `buildConversationVariables()`, añadir `{s_cliente(cliente)}` con una clave de catálogo nueva como `cliente_tratamiento`, y `{fecha_nacimiento}`. No añadir `{sexo}`.

### 5. Mantener el mismo resultado en la vista previa local de WhatsApp

**Archivos:** `resources/js/evidence-generator/lib/whatsapp/templates.ts`, `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/buildWhatsappConversation.tsx`, `resources/js/evidence-generator/features/preview/designs/whatsapp-desktop/buildWhatsappConversation.tsx`.

- [ ] Ampliar `buildWhatsappTemplateValues()` para recibir `sexoCliente` y `fechaNacimiento`; devolver el tratamiento visible bajo la clave `cliente(cliente)` y `fecha_nacimiento` visible, sin exponer una clave para el sexo original. Convertir `YYYY-MM-DD` a `DD/MM/YYYY` mediante `parseDateKey()` existente y `padStart(2, '0')` para día y mes; devolver `''` si no hay fecha. `formatDateDMY()` actual no añade ceros y no debe usarse directamente para esta variable. Usar extensiones `.ts` en los imports relativos de `templates.ts` para que `node --experimental-strip-types --test` pueda cargar el nuevo test.
- [ ] En `interpolateTemplate()`, reemplazar `{s_cliente(cliente)}` con `Sr`, `Sra` o `Sr/a` antes de la expresión genérica `/\{(\w+)\}/g`; esta expresión no admite paréntesis y por sí sola dejaría el placeholder sin resolver.
- [ ] Pasar `data.sexo` y `data.fecha_nacimiento` a `buildWhatsappTemplateValues()` desde ambos constructores de conversaciones locales. No modificar los mensajes `generatedMessages` enviados por el backend; la ruta local solo se usa cuando se construye el fallback.

### 6. Verificar y cerrar la ejecución

- [ ] Ejecutar `php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter=sexo`. Esperado: pasan los casos de validación, renderizado y reanudación.
- [ ] Ejecutar `node --experimental-strip-types --test resources/js/evidence-generator/lib/formState.test.ts resources/js/evidence-generator/lib/replayForm.test.ts resources/js/evidence-generator/features/conversations/conversationVariables.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts`. Esperado: pasan los casos de estado, selector y fallback local.
- [ ] Ejecutar `npx tsc --noEmit` para comprobar las firmas de eventos y `vendor/bin/pint --dirty --format agent` porque se modificaron archivos PHP. Revisar el diff resultante para comprobar que no hay migración, `{sexo}` ni cambios en los métodos o pruebas de la lógica del asesor.
- [ ] Comprobar en el diff y en las pruebas los tres casos `M/F/Vacío`, el formato con ceros de fecha, la fecha vacía, la reanudación con vacío explícito y el fallback local. Detenerse cuando estos criterios estén satisfechos. No crear commit.
