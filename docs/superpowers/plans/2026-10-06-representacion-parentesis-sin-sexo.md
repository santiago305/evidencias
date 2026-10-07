# Plan de implementación: representación con paréntesis al omitir sexo

> **Para quien ejecute el plan:** usar `executing-plans` y completar las casillas en orden. Este documento es el entregable de planificación; no implica que los cambios de producto ya estén aplicados.

**Objetivo:** Mantener la flexión actual con `m` y `f` y cambiar únicamente la presentación sin sexo de `profesor/ra` a `profesor(a)` cuando las dos formas permitan esa abreviatura.

**Arquitectura:** `s_cliente()` en TypeScript y `SpanishGenderInflector::inflect()` en PHP ya obtienen las formas masculina y femenina. Cada uno conservará su motor morfológico y llamará a un formateador puro de dos cadenas solo cuando falte el sexo. Ambos caminos deben aplicar el mismo criterio estructural; ninguna palabra ni pareja abreviada se añadirá a un diccionario.

**Tecnología:** Laravel 12, PHP 8.2, Pest 3, TypeScript y pruebas `node --test`. Sin dependencias, migraciones ni cambios de API.

---

## Análisis de la implementación actual

- `resources/js/lib/s_cliente.ts`: `s_cliente(palabra, genero?)` acepta `m`, `f` y nombres largos. Cuando `genero === undefined`, `neutralize()` ya llama dos veces al mismo motor. Su salida actual usa `/`: `profesor/ra`, `niño/a`, `actor/actriz`.
- `resources/js/lib/spanishGenderRules.ts` define reglas ordenadas y restringidas; `resources/js/lib/spanishGenderExceptions.ts` contiene las parejas irregulares y bloqueos. Estas dos fuentes permanecen intactas.
- `app/Services/Conversation/SpanishGenderInflector.php`: `inflect($word, $sex)` mantiene las ramas `M` y `F`; `dualForm()` recibe `null` o `''`, obtiene ambas formas y hoy compone la salida con `/`. La clase contiene su espejo de reglas y excepciones actuales; este plan no las modifica.
- `app/Services/Conversation/ConversationRenderService.php` recibe `sexo` internamente y conserva el tratamiento especial `{s_cliente(cliente)}` como `Sr/Sra/Sr/a`. `resources/js/evidence-generator/lib/whatsapp/templates.ts` hace lo mismo en la vista previa. Ambos seguirán llamando al motor igual que ahora; **no necesitan cambios**.
- Pruebas existentes: `resources/js/lib/s_cliente.test.ts`, `resources/js/evidence-generator/lib/whatsapp/templates.test.ts` y `tests/Feature/EvidenceGenerationTest.php`. Las expectativas sin sexo usan actualmente `/` y deberán actualizarse. Las de sexo explícito no deben cambiar.

## Contrato exacto de presentación

La salida entre paréntesis es una **abreviatura editorial de dos formas**, nunca un tercer género. Por convención del producto, `niño(a)` representa `niño` y `niña`; no se interpreta como concatenar literalmente `niño` con `a`.

1. Con sexo explícito, devolver exactamente lo que ya devuelve el motor. No entrar al formateador.
2. Sin sexo, obtener `masculine = s_cliente(word, 'm')` y `feminine = s_cliente(word, 'f')` (en PHP, `inflect(word, 'M')` y `inflect(word, 'F')`). Usar la palabra normalizada a NFC que la rama sin sexo ya extrae, y conservar sus espacios exteriores.
3. Si ambas formas son iguales, devolver la **entrada original**. Esto conserva invariables, bloqueos, expresiones de varias palabras y palabras que el motor no sabe flexionar.
4. Si la femenina es exactamente la masculina más una `a` o `A` final, mostrar `masculina(a)` o `MASCULINA(A)`. Ejemplos: `profesor`/`profesora` → `profesor(a)`; `doctor`/`doctora` → `doctor(a)`; `español`/`española` → `español(a)`.
5. Si ambas tienen el mismo número de caracteres Unicode, comparten todos excepto el último, la masculina termina en `o`, `O`, `e` o `E` y la femenina termina en `a` o `A`, mostrar `masculina(a)` con la `a/A` obtenida de la femenina. Ejemplos: `niño`/`niña` → `niño(a)`; `médico`/`médica` → `médico(a)`; `presidente`/`presidenta` → `presidente(a)`.
6. Si el motor reconoce dos formas distintas, pero no cumplen 4 ni 5, mostrar ambas completas separadas por `/`: `actor/actriz`, `rey/reina`, `campeón/campeona`, `guardián/guardiana`, `portugués/portuguesa`. Así se evitan grafías engañosas como `guardián(a)`, que perderían el cambio de tilde.

El formateador compara **las dos salidas reales**, no decide el género ni sustituye letras de la entrada para inventar una flexión. `exceptionForms` y `EXCEPTION_PAIRS` siguen utilizándose para **obtener** formas irregulares, pero no para decidir la notación. La capitalización ya la devuelve el motor al producir cada forma.

## Archivos exactos

| Acción | Archivo | Alcance |
| --- | --- | --- |
| Modificar | `resources/js/lib/s_cliente.ts` | Sustituir solamente el formato dentro de `neutralize()` y añadir `representGenderPair()` privado. |
| Modificar | `app/Services/Conversation/SpanishGenderInflector.php` | Sustituir solamente el formato dentro de `dualForm()` y añadir `representGenderPair()` privado. |
| Modificar | `resources/js/lib/s_cliente.test.ts` | Matriz de salida omitida y regresión explícita. |
| Modificar | `resources/js/evidence-generator/lib/whatsapp/templates.test.ts` | Expectativa sin sexo de la vista previa; tratamiento heredado intacto. |
| Modificar | `tests/Feature/EvidenceGenerationTest.php` | Expectativas sin sexo y pruebas de las parejas directas. |

No tocar `spanishGenderRules.ts`, `spanishGenderExceptions.ts`, `ConversationRenderService.php`, `templates.ts`, componentes, rutas, estilos, configuración ni dependencias. Antes de editar PHP, usar Laravel Boost `search-docs` con `packages=['laravel/framework','pestphp/pest']` y consultas sobre servicios y pruebas, como exige `AGENTS.md`.

## Tarea 1: fijar el comportamiento en pruebas que fallen

- [x] **1.1.** En `resources/js/lib/s_cliente.test.ts`, reemplazar únicamente el test `uses a compact dual form when gender is omitted` por esta matriz. Mantener los demás tests existentes:

```ts
test('represents both recognized forms when gender is omitted', () => {
    for (const [word, expected] of [
        ['profesor', 'profesor(a)'],
        ['profesora', 'profesor(a)'],
        ['Profesor', 'Profesor(a)'],
        ['PROFESOR', 'PROFESOR(A)'],
        ['niño', 'niño(a)'],
        ['niña', 'niño(a)'],
        ['doctor', 'doctor(a)'],
        ['doctora', 'doctor(a)'],
        ['director', 'director(a)'],
        ['ingeniero', 'ingeniero(a)'],
        ['ingeniera', 'ingeniero(a)'],
        ['abogado', 'abogado(a)'],
        ['médico', 'médico(a)'],
        ['MÉDICO', 'MÉDICO(A)'],
        ['me\u0301dico', 'médico(a)'],
        ['presidente', 'presidente(a)'],
        ['español', 'español(a)'],
        ['actor', 'actor/actriz'],
        ['actriz', 'actor/actriz'],
        ['rey', 'rey/reina'],
        ['reina', 'rey/reina'],
        ['hombre', 'hombre/mujer'],
        ['emperador', 'emperador/emperatriz'],
        ['campeón', 'campeón/campeona'],
        ['guardián', 'guardián/guardiana'],
        ['portuguesa', 'portugués/portuguesa'],
        ['estudiante', 'estudiante'],
        ['periodista', 'periodista'],
        ['artista', 'artista'],
        ['cantante', 'cantante'],
        ['mesa', 'mesa'],
        ['palabra desconocida', 'palabra desconocida'],
    ] as const) {
        assert.equal(s_cliente(word), expected, word);
    }
    assert.equal(s_cliente('profesor', undefined), 'profesor(a)');
    assert.equal(s_cliente('profesor', 'm'), 'profesor');
    assert.equal(s_cliente('profesor', 'f'), 'profesora');
    assert.equal(s_cliente('profesora', 'm'), 'profesor');
    assert.equal(s_cliente('profesora', 'f'), 'profesora');
});
```

- [x] **1.2.** En el test `client noun marker receives sex internally and keeps the legacy treatment` de `resources/js/evidence-generator/lib/whatsapp/templates.test.ts`, cambiar solo la expectativa del caso `sex === ''` a:

```ts
['', 'Trato Sr/a: profesor(a), niño(a), estudiante, actor/actriz; {sexo_cliente}'],
```

- [x] **1.3.** En el test `s_cliente sustantivos usa sexo interno y conserva el tratamiento` de `tests/Feature/EvidenceGenerationTest.php`, cambiar la expectativa del caso vacío a `Trato Sr/a: profesor(a), niño(a), estudiante, actor/actriz` y la expectativa sin sexo de la línea acentuada a `La médico(a)`. Sustituir la matriz final de parejas por esta, sin alterar el bucle HTTP de `M` y `F`:

```php
foreach ([
    ['profesor', 'profesora', 'profesor(a)'],
    ['niño', 'niña', 'niño(a)'],
    ['doctor', 'doctora', 'doctor(a)'],
    ['ingeniero', 'ingeniera', 'ingeniero(a)'],
    ['médico', 'médica', 'médico(a)'],
    ['presidente', 'presidenta', 'presidente(a)'],
    ['español', 'española', 'español(a)'],
    ['actor', 'actriz', 'actor/actriz'],
    ['rey', 'reina', 'rey/reina'],
    ['campeón', 'campeona', 'campeón/campeona'],
    ['guardián', 'guardiana', 'guardián/guardiana'],
    ['bailarín', 'bailarina', 'bailarín/bailarina'],
    ['portugués', 'portuguesa', 'portugués/portuguesa'],
    ['estudiante', 'estudiante', 'estudiante'],
    ['periodista', 'periodista', 'periodista'],
    ['artista', 'artista', 'artista'],
    ['mesa', 'mesa', 'mesa'],
] as [$masculine, $feminine, $representation]) {
    expect($inflector->inflect($masculine, 'F'))->toBe($feminine)
        ->and($inflector->inflect($feminine, 'M'))->toBe($masculine)
        ->and($inflector->inflect($masculine, null))->toBe($representation)
        ->and($inflector->inflect($feminine, null))->toBe($representation);
}

expect($inflector->inflect('PROFESOR', null))->toBe('PROFESOR(A)')
    ->and($inflector->inflect('  Médico  ', null))->toBe('  Médico(a)  ')
    ->and($inflector->inflect("me\u{0301}dico", null))->toBe('médico(a)');
```

- [x] **1.4.** Ejecutar las pruebas afectadas antes de editar producción. Las expectativas nuevas fallaron primero como se esperaba; las pruebas de `M` y `F` pasaron.

```powershell
node --experimental-strip-types --test resources/js/lib/s_cliente.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts
$php = 'C:\laragon\bin\php\php-8.4.4-Win32-vs17-x64\php.exe'
& $php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter='s_cliente sustantivos usa sexo interno'
```

## Tarea 2: implementar la representación sin tocar la morfología

- [x] **2.1.** En `resources/js/lib/s_cliente.ts`, se añadió este helper privado antes de `neutralize()`. Toma dos formas ya flexionadas; no consulta reglas ni excepciones:

```ts
function representGenderPair(masculine: string, feminine: string): string {
    const masculineLetters = [...masculine];
    const feminineLetters = [...feminine];
    const feminineLast = feminineLetters.at(-1);
    const isFeminineA = feminineLast === 'a' || feminineLast === 'A';

    if (isFeminineA && feminineLetters.length === masculineLetters.length + 1 && feminineLetters.slice(0, -1).join('') === masculine) {
        return `${masculine}(${feminineLast})`;
    }

    const masculineLast = masculineLetters.at(-1);
    if (
        isFeminineA &&
        feminineLetters.length === masculineLetters.length &&
        (masculineLast === 'o' || masculineLast === 'O' || masculineLast === 'e' || masculineLast === 'E') &&
        masculineLetters.slice(0, -1).join('') === feminineLetters.slice(0, -1).join('')
    ) {
        return `${masculine}(${feminineLast})`;
    }

    return `${masculine}/${feminine}`;
}
```

En `neutralize()`, conservar la normalización NFC, el regex, las dos llamadas a `s_cliente()` y el caso `masculine === feminine`. Reemplazar **todo lo que sigue a ese caso** (rama `exceptionForms.has`, cálculo de prefijo compartido y `/`) por:

```ts
return prefix + representGenderPair(masculine, feminine) + suffix;
```

No modificar la firma `s_cliente(palabra, genero?)`, `restoreCase()`, la rama de sexo explícito ni el mapa de excepciones usado por esa rama. Actualizar el comentario de `s_cliente()` para llamar a la salida omitida «abreviatura de ambas formas» en vez de «forma neutra».

- [x] **2.2.** En `app/Services/Conversation/SpanishGenderInflector.php`, se conservó `inflect()` y sus reglas. En `dualForm()`, se mantuvieron la normalización, regex, las dos llamadas a `inflect()` y el caso de formas iguales. Se reemplazó **todo lo que sigue a ese caso** por:

```php
return $parts[1].$this->representGenderPair($masculine, $feminine).$parts[3];
```

Añadir este método privado justo después de `dualForm()`; usa `mb_*` para que tildes y `ñ` se comparen como caracteres:

```php
private function representGenderPair(string $masculine, string $feminine): string
{
    $masculineLength = mb_strlen($masculine, 'UTF-8');
    $feminineLength = mb_strlen($feminine, 'UTF-8');
    $feminineLast = mb_substr($feminine, -1, 1, 'UTF-8');
    $isFeminineA = $feminineLast === 'a' || $feminineLast === 'A';

    if ($isFeminineA && $feminineLength === $masculineLength + 1
        && mb_substr($feminine, 0, $masculineLength, 'UTF-8') === $masculine) {
        return $masculine.'('.$feminineLast.')';
    }

    $masculineLast = mb_substr($masculine, -1, 1, 'UTF-8');
    if ($isFeminineA && $feminineLength === $masculineLength
        && in_array($masculineLast, ['o', 'O', 'e', 'E'], true)
        && mb_substr($masculine, 0, $masculineLength - 1, 'UTF-8')
            === mb_substr($feminine, 0, $feminineLength - 1, 'UTF-8')) {
        return $masculine.'('.$feminineLast.')';
    }

    return $masculine.'/'.$feminine;
}
```

No crear un registro de palabras para presentación y no tocar la rama `exceptionForms()` usada por la flexión explícita.

- [x] **2.3.** Ejecutar las mismas pruebas afectadas. Ambas pasan y las llamadas con sexo explícito conservan su salida anterior:

```powershell
node --experimental-strip-types --test resources/js/lib/s_cliente.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts
$php = 'C:\laragon\bin\php\php-8.4.4-Win32-vs17-x64\php.exe'
& $php artisan test --compact tests/Feature/EvidenceGenerationTest.php --filter='s_cliente sustantivos usa sexo interno'
```

## Tarea 3: ejecutar toda la suite y cerrar el alcance

- [x] **3.1.** Ejecutar **todos** los tests JavaScript existentes y **todos** los tests PHP existentes, como pide el usuario. En PowerShell, desde la raíz del proyecto:

```powershell
$jsTests = @(rg --files resources/js -g '*.test.ts' -g '*.test.tsx')
node --experimental-strip-types --test $jsTests
$php = 'C:\laragon\bin\php\php-8.4.4-Win32-vs17-x64\php.exe'
& $php artisan test --compact
```

En este equipo, `php` no está en `PATH`; el PHP 8.2 de Laragon carece de `pdo_sqlite`, por lo que las pruebas Pest se ejecutan con la ruta PHP 8.4 indicada. El código debe seguir siendo compatible con PHP 8.2; comprobar también su sintaxis con `& 'C:\laragon\bin\php\php-8.2.27-Win32-vs16-x64\php.exe' -l app/Services/Conversation/SpanishGenderInflector.php`. **Resultado:** JavaScript 235/276 aprobadas (41 fallidas en tests de snapshots, estructura, campos, formato horario y EPERM en dependencias); Pest 137 aprobadas y 2 fallidas por un CSS ausente y una clave duplicada en `ProfileSettingsTest`. Las fallidas no prueban archivos cambiados por esta tarea. No cambiar archivos fuera del alcance para silenciarlas.

- [x] **3.2.** Formatear solo el PHP modificado y verificar el estilo de los tres archivos TypeScript modificados:

```powershell
$php = 'C:\laragon\bin\php\php-8.4.4-Win32-vs17-x64\php.exe'
& $php vendor/bin/pint --dirty --format agent
npx eslint resources/js/lib/s_cliente.ts resources/js/lib/s_cliente.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts
npx prettier --check resources/js/lib/s_cliente.ts resources/js/lib/s_cliente.test.ts resources/js/evidence-generator/lib/whatsapp/templates.test.ts
git diff --check
```

- [x] **3.3.** Revisar `git diff --name-only` y `git diff`: los cinco archivos del producto coinciden con la tabla. `s_cliente('profesor', 'm'|'f')` e `inflect('profesor', 'M'|'F')` siguen iguales; `{s_cliente(cliente)}` continúa como `Sr/Sra/Sr/a`; no hay nuevas reglas, excepciones, dependencias ni variables de conversación. Se reportan arriba los fallos de las suites completas.

**Criterio de finalización:** `profesor(a)`, `niño(a)` y `médico(a)` salen de las dos formas calculadas por el motor; `actor/actriz` y las parejas con cambio de tilde muestran ambas formas completas; los invariables y desconocidos permanecen intactos; M/F conserva el comportamiento previo; las suites completas se ejecutaron y sus resultados se reportaron.
