# Conversation Variables UI Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the evidence form typing, wire the new registration datetime field, and add a variable picker in the conversation creation modal so custom conversation messages can insert supported form/user values with `{variable}` placeholders.

**Architecture:** Keep the existing Laravel/Inertia/React flow. The frontend owns the modal editing experience and sends conversation message templates unchanged; the backend remains the source of truth for rendering placeholders when evidence is generated. Advisor identity comes from the authenticated user instead of visible form inputs.

**Tech Stack:** Laravel 12.61, PHP 8.2, Pest 3, Inertia React 2.0.3, React 19, Tailwind CSS 4, Radix UI dropdown/dialog components.

---

## Estado Actual Del Programa

- `resources/js/evidence-generator/features/editor/components/DataForm.tsx` ya muestra los inputs visibles actuales: `telefono`, `nombre`, `monto`, `tasa`, `cuota`, `plazo`, `fechaHora`, `fechaHoraRegistro`, `duracion`, sal generada y completar por sal.
- `resources/js/evidence-generator/types.ts` declara `fechaHoraRegistro`, pero no declara `nombreAsesor` ni `dni`.
- `resources/js/evidence-generator/lib/formState.ts` todavia inicializa `nombreAsesor` y `dni`, pero no inicializa `fechaHoraRegistro`. Esto deja el tipado inconsistente.
- `resources/js/evidence-generator/lib/formState.test.ts` todavia espera `nombreAsesor` y `dni`, y no espera `fechaHoraRegistro`.
- `resources/js/evidence-generator/App.tsx` recibe `currentUser.name` y `currentUser.dni`, pero la generacion envia directamente `...form`. Si el formulario ya no incluye asesor/DNI, el backend no deberia depender de inputs visibles para esos datos.
- `app/Http/Requests/GenerateEvidenceRequest.php` todavia requiere `nombreAsesor` y `dni`, y no valida `fechaHoraRegistro`.
- `app/Services/Conversation/ConversationRenderService.php` ya interpola variables con formato `{clave}` usando una expresion regular que acepta letras, numeros y guion bajo. Actualmente reconoce claves como `{asesor}`, `{asesor_nombre}`, `{cliente}`, `{telefono}`, `{monto}`, `{cuota}`, `{plazo}`, `{tasa}`, `{fecha}`, `{hora}` y `{duracion}`.
- `resources/js/evidence-generator/features/conversations/components/NewConversationModal.tsx` permite crear/editar mensajes con un selector `Asesor/Cliente`, pero no muestra variables disponibles ni inserta placeholders en el textarea.

## Lo Que Queremos Lograr

- El formulario debe quedar tipado y estable despues de eliminar inputs visibles de asesor/DNI y agregar `fechaHoraRegistro`.
- La generacion debe recibir o construir correctamente `fechaHoraRegistro`.
- La identidad del asesor logueado debe venir de `currentUser.name` en frontend para vista previa local y del usuario autenticado en backend para generacion segura.
- La modal `NewConversationModal` debe mostrar un boton/desplegable `Variables` al costado del selector `Asesor/Cliente`.
- Al seleccionar una variable en ese desplegable, se debe insertar el placeholder en el textarea del mensaje actual.
- Si el usuario escribe manualmente un placeholder valido entre llaves, el backend debe interpolarlo al generar evidencia.
- Variables disponibles para la modal:
  - `{nombre_asesor}`: nombre del asesor logueado.
  - `{telefono}`: input telefono.
  - `{nombre_cliente}`: input nombre del cliente.
  - `{monto}`: input monto.
  - `{tasa}`: input tasa.
  - `{cuota}`: input cuota.
  - `{plazo}`: input plazo.
- Alias de compatibilidad que deben seguir funcionando:
  - `{asesor}` y `{asesor_nombre}` para asesor.
  - `{cliente}` para cliente.
  - `{monto_formateado}` y `{cuota_formateada}` si ya existen en conversaciones guardadas.
- Variables excluidas del desplegable por decision del producto:
  - `fechaHora`.
  - `fechaHoraRegistro`.
  - `duracion`.
  - sal generada.
  - completar por sal.
  - DNI.

## Decisiones De Diseño

- Usar placeholders sin espacios dentro de llaves. Ejemplo recomendado: `Hola {nombre_asesor}`. El parser actual no reconoce `{nombre asesor}` con espacio, asi que se usara `snake_case` para nombres legibles y seguros.
- No guardar valores reales dentro de las conversaciones. Las conversaciones deben guardar plantillas, por ejemplo `Hola {nombre_asesor}`, y al generar evidencia se reemplazan con los datos actuales del formulario/usuario.
- No crear una tabla nueva ni migraciones. Los mensajes ya se guardan como lineas de texto y el reemplazo ocurre en render.
- Reutilizar `resources/js/components/ui/dropdown-menu.tsx` para el desplegable de variables.
- Mantener el selector `Asesor/Cliente` en la modal y colocar `Variables` al costado, en la misma fila.

---

## Fase 1: Corregir Tipado Y Estado Inicial Del Formulario

**Objetivo:** Que el formulario, el estado inicial y las pruebas reflejen los campos reales.

**Archivos:**
- Revisar: `resources/js/evidence-generator/types.ts`
- Editar: `resources/js/evidence-generator/types.ts`
- Revisar: `resources/js/evidence-generator/lib/formState.ts`
- Editar: `resources/js/evidence-generator/lib/formState.ts`
- Revisar: `resources/js/evidence-generator/lib/formState.test.ts`
- Editar: `resources/js/evidence-generator/lib/formState.test.ts`

- [ ] **Tarea 1.1: Definir claramente el modelo frontend**

  En `resources/js/evidence-generator/types.ts`, separar mentalmente dos responsabilidades aunque se mantenga una sola interfaz por ahora:

  - Campos visibles editables: `telefono`, `nombre`, `monto`, `tasa`, `cuota`, `plazo`, `fechaHora`, `fechaHoraRegistro`, `duracion`, `modoEntrada`.
  - Identidad del asesor: proviene de `currentUser`, no de inputs visibles.

  Cambio recomendado:

  ```ts
  export interface FormState {
    telefono: string;
    nombre: string;
    monto: string;
    tasa: string;
    cuota: string;
    plazo: string;
    fechaHora: string;
    fechaHoraRegistro: string;
    duracion: string;
    modoEntrada: ModoEntrada;
  }
  ```

- [ ] **Tarea 1.2: Corregir `createInitialFormState`**

  En `resources/js/evidence-generator/lib/formState.ts`, eliminar `UserIdentity`, dejar de devolver `nombreAsesor` y `dni`, e inicializar `fechaHoraRegistro`.

  Resultado esperado:

  ```ts
  import type { FormState } from '../types';

  export function createInitialFormState(): FormState {
      return {
          telefono: '',
          nombre: '',
          monto: '',
          tasa: '',
          cuota: '',
          plazo: '',
          fechaHora: '',
          fechaHoraRegistro: '',
          duracion: '',
          modoEntrada: 'informativo',
      };
  }
  ```

- [ ] **Tarea 1.3: Ajustar pruebas de estado inicial**

  En `resources/js/evidence-generator/lib/formState.test.ts`, dejar una sola prueba que confirme que el estado inicial coincide con `FormState`.

  Ejemplo de asercion:

  ```ts
  assert.deepEqual(createInitialFormState(), {
      telefono: '',
      nombre: '',
      monto: '',
      tasa: '',
      cuota: '',
      plazo: '',
      fechaHora: '',
      fechaHoraRegistro: '',
      duracion: '',
      modoEntrada: 'informativo',
  });
  ```

- [ ] **Tarea 1.4: Ejecutar prueba frontend minima**

  Ejecutar:

  ```powershell
  node --test resources/js/evidence-generator/lib/formState.test.ts
  ```

  Resultado esperado: pasa la prueba de estado inicial.

---

## Fase 2: Enviar Y Validar `fechaHoraRegistro`

**Objetivo:** Que el input `Fecha y hora de registro` viaje desde el formulario hasta el backend y quede disponible para almacenamiento/render futuro sin depender de valores implicitos.

**Archivos:**
- Revisar: `resources/js/evidence-generator/App.tsx`
- Editar: `resources/js/evidence-generator/App.tsx`
- Revisar: `app/Http/Requests/GenerateEvidenceRequest.php`
- Editar: `app/Http/Requests/GenerateEvidenceRequest.php`
- Revisar: `app/Http/Controllers/EvidenceController.php`
- Editar: `app/Http/Controllers/EvidenceController.php`
- Revisar: `tests/Feature/EvidenceGenerationTest.php`
- Editar: `tests/Feature/EvidenceGenerationTest.php`
- Revisar: `tests/Feature/EvidenceGenerationSnapshotTest.php`
- Editar: `tests/Feature/EvidenceGenerationSnapshotTest.php`

- [ ] **Tarea 2.1: Dejar que `App.tsx` cree estado sin usuario**

  En `resources/js/evidence-generator/App.tsx`, cambiar:

  ```ts
  const [form, setForm] = useState<FormState>(() => createInitialFormState(currentUser));
  ```

  por:

  ```ts
  const [form, setForm] = useState<FormState>(() => createInitialFormState());
  ```

  Y al resetear despues de generar, cambiar:

  ```ts
  setForm(createInitialFormState(currentUser));
  ```

  por:

  ```ts
  setForm(createInitialFormState());
  ```

- [ ] **Tarea 2.2: Mantener asesor/DNI fuera del payload frontend**

  En `resources/js/evidence-generator/App.tsx`, conservar el POST con los campos de `form` y `seedCode`, sin agregar `nombreAsesor` ni `dni`.

  Payload esperado:

  ```ts
  const response = await postJson<GenerateEvidenceResponse>(route('evidences.generate'), {
      ...form,
      ...(seedCodeInput.trim() !== '' ? { seedCode: seedCodeInput.trim() } : {}),
  });
  ```

- [ ] **Tarea 2.3: Construir `SavedData` con usuario logueado para preview**

  En `resources/js/evidence-generator/types.ts`, ajustar `SavedData` para incluir los datos de asesor que necesita el preview:

  ```ts
  export type SavedData = FormState & {
    nombreAsesor: string;
    dni: string;
    tipoCliente: TipoCliente;
    conversationId?: string;
    seedCode?: string;
    generatedMessages?: GeneratedMessage[];
    progress?: ConversationProgressSummary;
    trayProfile?: WindowsTrayProfile;
    previewSnapshot?: PreviewSnapshot;
  };
  ```

  En `resources/js/evidence-generator/App.tsx`, al llamar `setSaved`, agregar:

  ```ts
  nombreAsesor: currentUser.name,
  dni: currentUser.dni,
  ```

- [ ] **Tarea 2.4: Validar `fechaHoraRegistro` en backend**

  En `app/Http/Requests/GenerateEvidenceRequest.php`, quitar reglas de `nombreAsesor` y `dni` porque no vendran de inputs visibles. Agregar:

  ```php
  'fechaHoraRegistro' => ['required', 'string', 'max:40'],
  ```

- [ ] **Tarea 2.5: Inyectar identidad autenticada en el backend**

  En `app/Http/Controllers/EvidenceController.php`, construir el input final con el usuario autenticado:

  ```php
  public function generate(GenerateEvidenceRequest $request): JsonResponse
  {
      $user = $request->user();

      $result = $this->generatorService->generate($user, [
          ...$request->validated(),
          'nombreAsesor' => $user->name,
          'dni' => $user->dni,
      ]);

      return response()->json($result);
  }
  ```

  Razon: el backend no debe confiar en nombre/DNI enviados por el navegador si ya pertenecen al usuario logueado.

- [ ] **Tarea 2.6: Actualizar payloads de pruebas**

  En `tests/Feature/EvidenceGenerationTest.php` y `tests/Feature/EvidenceGenerationSnapshotTest.php`:

  - Quitar `nombreAsesor` y `dni` de los payloads enviados a `evidences.generate`.
  - Agregar `fechaHoraRegistro`, por ejemplo:

  ```php
  'fechaHoraRegistro' => '2026-05-29T10:25',
  ```

- [ ] **Tarea 2.7: Ejecutar pruebas de generacion**

  Ejecutar:

  ```powershell
  php artisan test --compact tests/Feature/EvidenceGenerationTest.php
  php artisan test --compact tests/Feature/EvidenceGenerationSnapshotTest.php
  ```

  Resultado esperado: las pruebas pasan sin exigir `nombreAsesor` ni `dni` en el request.

---

## Fase 3: Definir Catalogo De Variables Para La Modal

**Objetivo:** Tener una fuente tipada y reutilizable para las variables que se muestran al usuario en `NewConversationModal`.

**Archivos:**
- Crear: `resources/js/evidence-generator/features/conversations/conversationVariables.ts`
- Revisar: `resources/js/evidence-generator/App.tsx`
- Editar: `resources/js/evidence-generator/App.tsx`
- Revisar: `resources/js/evidence-generator/features/conversations/components/NewConversationModal.tsx`
- Editar: `resources/js/evidence-generator/features/conversations/components/NewConversationModal.tsx`

- [ ] **Tarea 3.1: Crear tipo y helper de variables**

  Crear `resources/js/evidence-generator/features/conversations/conversationVariables.ts`.

  Contenido recomendado:

  ```ts
  import type { FormState } from '../../types';

  export interface ConversationVariable {
      key: string;
      label: string;
      value: string;
      placeholder: string;
      description: string;
  }

  export function buildConversationVariables(form: FormState, advisorName: string): ConversationVariable[] {
      return [
          {
              key: 'nombre_asesor',
              label: 'Nombre asesor',
              value: advisorName,
              placeholder: '{nombre_asesor}',
              description: 'Nombre del asesor logueado',
          },
          {
              key: 'telefono',
              label: 'Telefono',
              value: form.telefono,
              placeholder: '{telefono}',
              description: 'Telefono ingresado en el formulario',
          },
          {
              key: 'nombre_cliente',
              label: 'Nombre cliente',
              value: form.nombre,
              placeholder: '{nombre_cliente}',
              description: 'Nombre del cliente ingresado',
          },
          {
              key: 'monto',
              label: 'Monto',
              value: form.monto,
              placeholder: '{monto}',
              description: 'Monto ingresado',
          },
          {
              key: 'tasa',
              label: 'Tasa',
              value: form.tasa,
              placeholder: '{tasa}',
              description: 'Tasa ingresada',
          },
          {
              key: 'cuota',
              label: 'Cuota',
              value: form.cuota,
              placeholder: '{cuota}',
              description: 'Cuota ingresada',
          },
          {
              key: 'plazo',
              label: 'Plazo',
              value: form.plazo,
              placeholder: '{plazo}',
              description: 'Plazo ingresado',
          },
      ];
  }
  ```

- [ ] **Tarea 3.2: Construir variables en `App.tsx`**

  En `resources/js/evidence-generator/App.tsx`, importar:

  ```ts
  import { buildConversationVariables } from './features/conversations/conversationVariables';
  ```

  Crear un valor derivado:

  ```ts
  const conversationVariables = useMemo(
      () => buildConversationVariables(form, currentUser.name),
      [form, currentUser.name],
  );
  ```

- [ ] **Tarea 3.3: Pasar variables a la modal**

  En `resources/js/evidence-generator/features/conversations/components/NewConversationModal.tsx`, agregar prop:

  ```ts
  variables: ConversationVariable[];
  ```

  En `resources/js/evidence-generator/App.tsx`, pasar:

  ```tsx
  variables={conversationVariables}
  ```

---

## Fase 4: Agregar Desplegable De Variables En `NewConversationModal`

**Objetivo:** Que el usuario pueda hacer clic en `Variables` y insertar placeholders en el mensaje que esta editando.

**Archivos:**
- Revisar: `resources/js/components/ui/dropdown-menu.tsx`
- Revisar: `resources/js/components/ui/button.tsx`
- Editar: `resources/js/evidence-generator/features/conversations/components/NewConversationModal.tsx`

- [ ] **Tarea 4.1: Importar componentes de dropdown**

  En `NewConversationModal.tsx`, importar:

  ```ts
  import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import type { ConversationVariable } from '../conversationVariables';
  ```

- [ ] **Tarea 4.2: Crear helper para insertar placeholders**

  En `NewConversationModal.tsx`, agregar una funcion que inserte al final del texto actual para una primera version simple y estable:

  ```ts
  const insertVariable = (messageId: string, placeholder: string) => {
      setMessages((previous) =>
          previous.map((message) => {
              if (message.id !== messageId) {
                  return message;
              }

              const separator = message.linesText === '' || message.linesText.endsWith(' ') ? '' : ' ';

              return {
                  ...message,
                  linesText: `${message.linesText}${separator}${placeholder}`,
              };
          }),
      );
  };
  ```

  Razon: insertar al cursor seria ideal, pero requiere refs por textarea. Esta fase prioriza estabilidad y luego se puede mejorar a insercion exacta.

- [ ] **Tarea 4.3: Colocar boton `Variables` al costado del selector**

  En la fila donde existe el `<select>`, cambiar el contenedor para mantener ambos controles:

  ```tsx
  <div className="mb-2 flex flex-wrap items-center gap-2">
      <select>...</select>

      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <button
                  type="button"
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                  Variables
              </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>Variables disponibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {variables.map((variable) => (
                  <DropdownMenuItem
                      key={variable.key}
                      onClick={() => insertVariable(message.id, variable.placeholder)}
                      className="flex flex-col items-start gap-0.5"
                  >
                      <span className="text-xs font-semibold text-slate-900">{variable.label}</span>
                      <span className="font-mono text-[11px] text-slate-500">{variable.placeholder}</span>
                      <span className="text-[11px] text-slate-400">
                          Valor actual: {variable.value.trim() || 'Sin completar'}
                      </span>
                  </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
      </DropdownMenu>
  </div>
  ```

- [ ] **Tarea 4.4: Mantener responsive y legible**

  Confirmar que en pantallas angostas los controles bajan de linea por `flex-wrap` y no rompen el textarea.

- [ ] **Tarea 4.5: Validar manualmente flujo de modal**

  Acciones a probar en navegador:

  - Abrir `Nueva conversacion`.
  - Seleccionar `Variables`.
  - Insertar `{nombre_asesor}` en un mensaje.
  - Escribir manualmente `Hola {nombre_cliente}`.
  - Guardar conversacion.
  - Abrir `Ver conversaciones`.
  - Editar la conversacion y confirmar que los placeholders se conservan.

---

## Fase 5: Alinear Interpolacion Backend Con Nuevas Variables

**Objetivo:** Que los placeholders mostrados en la modal sean reemplazados correctamente al generar evidencia.

**Archivos:**
- Revisar: `app/Services/Conversation/ConversationRenderService.php`
- Editar: `app/Services/Conversation/ConversationRenderService.php`
- Revisar: `tests/Feature/EvidenceGenerationTest.php`
- Editar: `tests/Feature/EvidenceGenerationTest.php`

- [ ] **Tarea 5.1: Agregar alias nuevos en `buildVariables`**

  En `app/Services/Conversation/ConversationRenderService.php`, dentro del array retornado por `buildVariables`, agregar:

  ```php
  'nombre_asesor' => $asesor !== '' ? $asesor : 'Asesor',
  'nombre_cliente' => $cliente !== '' ? $cliente : 'Cliente',
  ```

  Mantener existentes:

  ```php
  'cliente' => $cliente !== '' ? $cliente : 'Cliente',
  'asesor' => $asesor !== '' ? $asesor : 'Asesor',
  'asesor_nombre' => $asesor !== '' ? $asesor : 'Asesor',
  ```

- [ ] **Tarea 5.2: No agregar variables excluidas al desplegable**

  No cambiar el backend para impedir `{fecha}`, `{hora}` o `{duracion}` si ya existen; pueden seguir funcionando en conversaciones antiguas. La restriccion del producto aplica al desplegable de variables nuevas, no a borrar compatibilidad.

- [ ] **Tarea 5.3: Probar interpolacion nueva**

  En `tests/Feature/EvidenceGenerationTest.php`, agregar o ajustar una prueba que cree una conversacion con lineas:

  ```php
  [
      'side' => 'out',
      'lines' => ['Hola {nombre_asesor}, cliente {nombre_cliente}, telefono {telefono}.'],
  ],
  [
      'side' => 'out',
      'lines' => ['Monto {monto}, tasa {tasa}, cuota {cuota}, plazo {plazo}.'],
  ],
  ```

  Enviar payload sin `nombreAsesor` ni `dni`, pero autenticado como usuario con `name`.

  Asertar que la respuesta contiene:

  - Nombre del usuario autenticado en lugar de `{nombre_asesor}`.
  - Nombre del cliente del payload en lugar de `{nombre_cliente}`.
  - Telefono/monto/tasa/cuota/plazo reemplazados.

- [ ] **Tarea 5.4: Ejecutar prueba backend especifica**

  Ejecutar:

  ```powershell
  php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter=variables
  ```

  Si el nombre de prueba no incluye `variables`, ejecutar el archivo completo:

  ```powershell
  php artisan test --compact tests/Feature/EvidenceGenerationTest.php
  ```

---

## Fase 6: Ajustar Resumen De Preview Y Campo De Registro

**Objetivo:** Que la interfaz muestre claramente los datos usados, incluyendo `fechaHoraRegistro`, sin reintroducir inputs eliminados.

**Archivos:**
- Revisar: `resources/js/evidence-generator/features/preview/components/PreviewBlock.tsx`
- Editar: `resources/js/evidence-generator/features/preview/components/PreviewBlock.tsx`
- Revisar: `resources/js/evidence-generator/types.ts`

- [ ] **Tarea 6.1: Mostrar fecha de registro en resumen**

  En `PreviewBlock.tsx`, agregar:

  ```tsx
  <Row k="Fecha/Hora registro" v={data.fechaHoraRegistro} />
  ```

  junto a:

  ```tsx
  <Row k="Fecha/Hora" v={data.fechaHora} />
  <Row k="Duracion (min)" v={data.duracion} />
  ```

- [ ] **Tarea 6.2: Mantener asesor/DNI como datos de usuario, no inputs**

  Mantener estas filas si el resumen debe seguir mostrando identidad:

  ```tsx
  <Row k="Nombre de asesor" v={data.nombreAsesor} />
  <Row k="DNI" v={data.dni} />
  ```

  Razon: mostrar no significa volver a pedir el dato en el formulario. Son datos derivados del usuario logueado.

---

## Fase 7: Verificacion Integral

**Objetivo:** Confirmar que tipado, backend, frontend y formato quedaron consistentes.

**Archivos/comandos:**
- Ejecutar: `node --test resources/js/evidence-generator/lib/formState.test.ts`
- Ejecutar: `php artisan test --compact tests/Feature/EvidenceGenerationTest.php`
- Ejecutar: `php artisan test --compact tests/Feature/EvidenceGenerationSnapshotTest.php`
- Ejecutar: `vendor/bin/pint --dirty --format agent`
- Ejecutar: `npm run build`

- [ ] **Tarea 7.1: Pruebas frontend unitarias**

  ```powershell
  node --test resources/js/evidence-generator/lib/formState.test.ts
  ```

- [ ] **Tarea 7.2: Pruebas backend afectadas**

  ```powershell
  php artisan test --compact tests/Feature/EvidenceGenerationTest.php
  php artisan test --compact tests/Feature/EvidenceGenerationSnapshotTest.php
  ```

- [ ] **Tarea 7.3: Formato PHP**

  Si se modificaron archivos PHP:

  ```powershell
  vendor/bin/pint --dirty --format agent
  ```

- [ ] **Tarea 7.4: Build frontend**

  ```powershell
  npm run build
  ```

  Resultado esperado: Vite compila sin errores de TypeScript/React.

---

## Riesgos Y Cuidados

- Si se deja `GenerateEvidenceRequest` requiriendo `nombreAsesor` y `dni`, la generacion fallara porque esos inputs ya no existen en el formulario.
- Si `fechaHoraRegistro` no se inicializa en `createInitialFormState`, React puede enviar `undefined` o dejar un campo controlado inconsistente.
- Si el desplegable muestra `{nombre asesor}` con espacio, el backend no lo reemplazara. Por eso se usa `{nombre_asesor}`.
- Si se agregan variables al frontend pero no al backend, el usuario podra insertarlas pero se veran sin reemplazar en la evidencia.
- Si se eliminan alias antiguos como `{asesor}` o `{cliente}`, conversaciones guardadas antes pueden cambiar de comportamiento.

## Orden Recomendado De Implementacion

1. Fase 1: corregir tipado y estado inicial.
2. Fase 2: validar `fechaHoraRegistro` y derivar asesor/DNI desde usuario autenticado.
3. Fase 5: agregar alias backend y prueba de interpolacion.
4. Fase 3: crear catalogo frontend de variables.
5. Fase 4: agregar dropdown en modal.
6. Fase 6: ajustar resumen.
7. Fase 7: ejecutar verificaciones.

## Criterio De Aceptacion

- El formulario ya no necesita inputs visibles de asesor/DNI para generar evidencia.
- `fechaHoraRegistro` existe en `FormState`, se inicializa, se envia, se valida y se conserva en `SavedData`.
- La modal muestra un boton `Variables` al costado del selector `Asesor/Cliente`.
- Clic en una variable inserta su placeholder en el mensaje.
- Conversaciones con `{nombre_asesor}`, `{nombre_cliente}`, `{telefono}`, `{monto}`, `{tasa}`, `{cuota}` y `{plazo}` se renderizan con datos reales al generar evidencia.
- No aparecen en el desplegable variables de fecha/hora, registro, duracion, DNI ni sal.
- Pruebas frontend y backend afectadas pasan.
- `npm run build` compila correctamente.
