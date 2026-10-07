# Plan de implementación: género implícito en variables de conversación

> **Para la ejecución:** este archivo es el entregable solicitado. No aplicar cambios al producto hasta que el usuario pida ejecutar el plan. Completar las casillas en orden y conservar los cambios que ya existan en el árbol de trabajo.

**Objetivo:** Que una plantilla guarde `{s_cliente(profesor)}` sin un argumento de sexo visible, produzca `profesor` o `profesora` según el campo **Sexo**, y produzca `profesor/ra` cuando el campo esté vacío.

**Arquitectura:** El formulario ya envía `sexo` como `M`, `F` o vacío. El renderizador de Laravel y el renderizador de vista previa recibirán ese dato como contexto interno, lo convertirán a `m`, `f` o ausencia de selección y resolverán el marcador. La forma doble se calculará a partir de las formas masculina y femenina del motor morfológico; no habrá una lista de formatos neutrales por palabra ni una nueva variable de conversación para el sexo.

**Tecnología:** Laravel 12, PHP 8.2, Inertia/React 19, TypeScript, pruebas Node y Pest. Sin dependencias, migraciones ni configuración nuevas.

---

## Estado actual y decisión

- `resources/js/evidence-generator/features/editor/components/DataForm.tsx` ya ofrece `M`, `F` y `Vacío`; `resources/js/evidence-generator/types.ts` ya tiene `form.sexo`.
- `resources/js/evidence-generator/features/conversations/conversationVariables.ts` inserta `{s_cliente(cliente)}`. Ese marcador **ya significa tratamiento** y se resuelve como `Sr`, `Sra` o `Sr/a`. Conservarlo para no alterar conversaciones guardadas. Permitir adicionalmente `{s_cliente(profesor)}`, `{s_cliente(niño)}` y otros sustantivos escritos dentro del marcador. No añadir `{sexo}` ni `{sexo_cliente}` al selector de variables.
- `resources/js/lib/s_cliente.ts` ya flexiona sustantivos con `m` y `f`, pero hoy requiere el segundo argumento y no presenta forma doble. `app/Services/Conversation/ConversationRenderService.php` procesa conversaciones guardadas en el servidor; `resources/js/evidence-generator/lib/whatsapp/templates.ts` procesa plantillas de la simulación local. Ambos caminos deben coincidir.
- La forma doble es una **convención de presentación**, no un tercer género gramatical. La salida solicitada es exactamente `Profesor/ra` y `niño/a`. Como referencia de la alternancia abreviada, la [RAE documenta «profesor, ra» y «niño, ña»](https://www.rae.es/sites/default/files/2020-07/La_vigesimotercera_edicion.pdf); la barra es la convención elegida para este producto.

Se descartan dos atajos: resolver solo en React dejaría distinta la evidencia generada por Laravel; resolver solo en Laravel dejaría distinta la simulación local. El pequeño formateador PHP debe reproducir las reglas y las excepciones existentes del motor TypeScript. Los casos compartidos de prueba protegerán la equivalencia sin introducir un diccionario de formas dobles.

## Contrato visible

| Plantilla guardada | Sexo `M` | Sexo `F` | Sexo vacío |
| --- | --- | --- | --- |
| `{s_cliente(profesor)}` | `profesor` | `profesora` | `profesor/ra` |
| `{s_cliente(Profesor)}` | `Profesor` | `Profesora` | `Profesor/ra` |
| `{s_cliente(niño)}` | `niño` | `niña` | `niño/a` |
| `{s_cliente(campeón)}` | `campeón` | `campeona` | `campeón/ona` |
| `{s_cliente(actor)}` | `actor` | `actriz` | `actor/actriz` |
| `{s_cliente(estudiante)}` | `estudiante` | `estudiante` | `estudiante` |
| `{s_cliente(cliente)}` | `Sr` | `Sra` | `Sr/a` |

El texto de una conversación puede escribirse como `Hola, {s_cliente(profesor)}`; el sexo se añade al **evaluar** la plantilla, no a su texto almacenado. Una entrada vacía o con más de una palabra dentro del marcador se deja sin resolver para que el autor pueda corregirla. Los marcadores de género del asesor siguen separados.

## Regla de forma doble

1. Obtener las dos formas mediante el motor existente: `masculina = s_cliente(palabra, 'm')` y `femenina = s_cliente(palabra, 'f')`. Si son idénticas, devolver la palabra original. Esto conserva invariables y bloqueos.
2. Si la pareja está en `exceptionPairs`, mostrar las dos formas completas: `actor/actriz`, `rey/reina`. No intentar abreviar heterónimos.
3. Para parejas regulares, hallar el prefijo común Unicode de ambas formas y mostrar `masculina + '/' + restoFemenino`. Ejemplo: `niño` + `niña` comparte `niñ`, luego `niño/a`. Las tildes distintas quedan dentro de los restos: `campeón/ona`, `portugués/esa`.
4. Si la forma masculina completa es prefijo de la femenina, repetir **solo la última letra masculina** en el resto femenino para seguir la notación pedida: `profesor` + `profesora` → `profesor/ra`; `español` + `española` → `español/la`. Conservar el patrón de mayúsculas y los espacios de entrada que ya maneja el motor.
5. Si no existe una flexión segura, devolver la entrada. `neutro` continúa sin ser un valor válido de la API: la ausencia de selección activa únicamente esta presentación doble.

El marcador `{s_cliente(palabra)}` declara que el autor está proporcionando un sustantivo de persona o animal. Las dos cadenas de la API no contienen información suficiente para reconocer cualquier objeto polisémico o desconocido. Los objetos provenientes de un campo conocido como inventario deben insertarse como texto normal; los bloqueos actuales siguen cubriendo colisiones conocidas. No prometer que un objeto arbitrario dentro del marcador quede intacto.

## Archivos previstos

| Archivo | Cambio preciso |
| --- | --- |
| `resources/js/lib/s_cliente.ts` | Aceptar segundo argumento omitido y componer forma doble con las dos flexiones actuales. Mantener `m`, `f` y alias largos. |
| `resources/js/lib/s_cliente.test.ts` | Casos de forma doble, irregular, invariable, tilde, mayúsculas y entrada femenina. |
| `app/Services/Conversation/SpanishGenderInflector.php` | Clase pura con el mismo orden de reglas, habilitaciones léxicas, bloqueos y 25 excepciones ya existentes; método `inflect(string $word, ?string $sex): string`. |
| `app/Services/Conversation/ConversationRenderService.php` | Inyectar la clase; pasar el sexo de `render()` a `interpolate()`, resolver primero `{s_cliente(cliente)}` y después los demás `{s_cliente(palabra)}`, sin agregar el sexo al mapa de variables. |
| `resources/js/evidence-generator/lib/whatsapp/templates.ts` | Recibir sexo como tercer parámetro interno de `interpolateTemplate`, resolver el tratamiento antes de los sustantivos y llamar `s_cliente(word, 'm' | 'f' | undefined)`. |
| `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/buildWhatsappConversation.tsx` | Pasar `data.sexo` a `interpolateTemplate` al normalizar las líneas. |
| `resources/js/evidence-generator/features/preview/designs/whatsapp-desktop/buildWhatsappConversation.tsx` | Pasar el mismo contexto a la otra simulación. |
| `resources/js/evidence-generator/lib/whatsapp/templates.test.ts` | Una matriz `M/F/vacío` del marcador de sustantivo y regresión del tratamiento. |
| `tests/Feature/EvidenceGenerationTest.php` | Una prueba de generación con los tres valores de sexo y los mismos ejemplos; conservar las pruebas previas. |

No cambiar `DataForm.tsx`, `conversationVariables.ts`, componentes de estilos, rutas, almacenamiento ni dependencias.

## Fase única de ejecución

- [ ] **1. Fijar comportamiento con las pruebas mínimas.** Antes de editar producción, usar Laravel Boost `search-docs` para el patrón de prueba/servicio aplicable. Añadir en `s_cliente.test.ts` una prueba parametrizada que verifique `Profesor/ra`, `niño/a`, `campeón/ona`, `actor/actriz`, `estudiante` y una entrada femenina como `profesora`. Añadir en `templates.test.ts` una matriz `M/F/vacío` para `{s_cliente(profesor)}` y confirmar que `{s_cliente(cliente)}` continúa como `Sr/Sra/Sr/a` y `{sexo_cliente}` queda literal. En `EvidenceGenerationTest.php`, crear una prueba llamada «s_cliente sustantivos usa sexo interno» con la línea `Trato {s_cliente(cliente)}: {s_cliente(profesor)}, {s_cliente(niño)}, {s_cliente(estudiante)}, {s_cliente(actor)}` y verificar la línea generada para los tres valores. Ejecutar solo estas pruebas nuevas y comprobar que fallan por la función aún ausente.

- [ ] **2. Extender el motor TypeScript.** Cambiar la firma a `s_cliente(palabra: string, genero?: GeneroGramatical): string`. Resolver `m` y `f` exactamente como hoy; si se omite `genero`, aplicar los cinco puntos de la regla de forma doble. Extraer una función privada para el prefijo común por caracteres Unicode y reutilizar `exceptionPairs` existente. Mantener el retorno original para género explícito inválido, entradas mal formadas y palabras bloqueadas. Ningún registro nuevo de pares dobles.

- [ ] **3. Conectar los dos renderizadores.** Crear `SpanishGenderInflector.php` con `php artisan make:class Services/Conversation/SpanishGenderInflector --no-interaction`. Replicar en PHP las reglas ordenadas, excepciones y bloqueos actuales; usar `mb_*` para corte de cadenas y restauración de mayúsculas. Cambiar la firma privada a `interpolate(string $line, array $variables, ?string $sexoCliente): string` y pasar `$input['sexo'] ?? null` desde el bucle de `render()`. Mantener el reemplazo exacto de `{s_cliente(cliente)}` antes de una expresión regular para los demás marcadores. No agregar el sexo al mapa de variables. En `templates.ts`, agregar el argumento interno `sexoCliente?: string`; pasar `data.sexo` desde las dos funciones `buildWhatsappConversation`. Aplicar solo a argumentos de una palabra española; dejar intacto el marcador incompleto o mal formado.

- [ ] **4. Verificación final acotada.** Ejecutar los dos archivos de pruebas Node en un comando y las pruebas Pest filtradas de género de cliente en otro. Ejecutar `php vendor/bin/pint --dirty --format agent` por el archivo PHP, ESLint/Prettier sobre los TypeScript modificados y comprobar `git diff --check`. Si el chequeo global de TypeScript aún informa el error previo de `resources/js/evidence-generator/lib/designTabItems.ts:12`, registrarlo como ajeno a este plan y comprobar que no hay diagnósticos nuevos en los archivos tocados. Revisar el diff para confirmar que el selector de variables no muestra el sexo y que ninguna plantilla guardada incorpora `,m` o `,f`.

Comandos de prueba previstos en PowerShell:

```powershell
node --experimental-strip-types --test resources/js/lib/s_cliente.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts
php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter='sexo|s_cliente'
php vendor/bin/pint --dirty --format agent
git diff --check
```

**Criterio de cierre:** los tres estados de `sexo` producen las salidas de la tabla tanto en la generación Laravel como en la simulación local; `{s_cliente(cliente)}` conserva el tratamiento; el sexo no aparece como variable insertable; las palabras invariables y bloqueadas siguen intactas; solo se han ejecutado las pruebas afectadas.
