# Motor de género: reglas productivas y excepciones reales

**Estado:** diseño implementado en el motor TypeScript. La API de dos argumentos acepta «m» y «f» y conserva «masculino» y «femenino» por compatibilidad.

## Corrección de la propuesta anterior

La propuesta anterior ponía cinco voces en -és y varias formas en -án dentro de exceptionPairs porque las reglas actuales no las cubrían. Ese criterio confundía «regla aún no implementada» con «excepción lingüística». También proponía 48 bloqueos de objetos: una lista así nunca podrá representar todos los sustantivos inanimados. **Esas dos recomendaciones quedan sustituidas por este diseño.**

La [Nueva gramática de la lengua española, §§ 11.2 y 11.4](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf) documenta patrones productivos para nombres de persona y animal, pero también nombres comunes en cuanto al género, epicenos y formas regionales. Una regla de sufijo necesita saber cuándo es aplicable; el sufijo no identifica por sí mismo el sentido de una palabra.

## Decisión de arquitectura

| Enfoque | Cobertura | Riesgo |
| --- | --- | --- |
| Sufijos universales y una lista creciente de bloqueos | Alta al principio | Falsos positivos sin límite: febrero, arnés, sudor, etc. |
| Solo pares de palabras | Alta para los pares registrados | Se transforma en el diccionario masivo que se quiere evitar. |
| **Reglas productivas + contrato para nombres animados + bloqueos acotados** | Alta para el dominio previsto | Una palabra inanimada pasada por error puede coincidir con una regla. |

Se recomienda el tercer enfoque. **La API pública propuesta tiene exactamente dos argumentos y admite las abreviaturas «m» y «f»:**

~~~tsx
type GeneroCliente = 'm' | 'f';

s_cliente('profesor', 'm'); // profesor
s_cliente('profesor', 'f'); // profesora
s_cliente('profesora', 'm'); // profesor

<span>{s_cliente('profesor', 'm')}</span>
<span>{s_cliente(nombreRol, 'f')}</span>
~~~

La implementación acepta ambas abreviaturas y mantiene las formas largas como alias. Ningún componente necesita pasar un tercer argumento ni decidir qué regla lingüística corresponde.

El **contrato de uso** es que la primera palabra designa una persona o un animal. El motor combina reglas ordenadas, invariables, excepciones irregulares y bloqueos acotados para errores frecuentes. No puede distinguir todos los sentidos con solo dos cadenas: *florero* puede ser vendedor o recipiente, según el [DLE](https://dle.rae.es/florero); [factor](https://dle.rae.es/factor) y [llavero](https://dle.rae.es/llavero) también son polisémicos. Para estas voces, el comportamiento por defecto debe ser conservador: devolver la entrada sin transformación. Si se exige a la vez flexionar **todos** los nombres animados y nunca tocar **ningún** objeto desconocido, esos requisitos no son resolubles con esta firma sin información léxica adicional.

## Inventario de reglas que sí deben estar en el motor

**Condición común de las reglas flexivas:** la palabra designa un ser animado o un gentilicio sustantivado, y no está marcada como común en cuanto al género o epicena en ese sentido. Cada regla funciona en las dos direcciones y se aplica a un sufijo completo, después de normalizar a Unicode NFC. La [gramática académica, §§ 11.4n-o y 11.5c](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf) aporta las pautas y los límites de estas terminaciones.

| Prioridad | Regla | Ejemplos de ida y vuelta | Límite necesario |
| --- | --- | --- | --- |
| 1 | **-or ↔ -ora**. Incluye -dor, -tor, -sor y -ñor; no hace falta una regla por cada subcadena. | autor/autora; tutor/tutora; profesor/profesora; doctor/doctora; señor/señora; trabajador/trabajadora. | Solo nombres de seres; *sudor*, *motor* o *ruiseñor* no son ejemplos de flexión. La regla general cubre casos que hoy faltan, como autor y tutor. |
| 2 | **-ón ↔ -ona**, con pérdida o restitución de la tilde. Sustituye las subreglas actuales -eón, -drón y -trón. | campeón/campeona; león/leona; anfitrión/anfitriona; ladrón/ladrona; patrón/patrona; peatón/peatona. | Excluir objetos como *acordeón* y *panteón*. Las formas irregulares, como barón/baronesa, tienen prioridad. |
| 3 | **-án ↔ -ana**, con ajuste de tilde. | capitán/capitana; alemán/alemana; catalán/catalana; guardián/guardiana; musulmán/musulmana; charlatán/charlatana. | Solo referentes que admiten flexión; *volcán* no se transforma por compartir la terminación. |
| 4 | **-ín ↔ -ina**, con ajuste de tilde. | bailarín/bailarina; danzarín/danzarina. | Requiere referente animado. *Jardín* no es *jardina*; el [DLE registra bailarín/bailarina](https://dle.rae.es/bailar%C3%ADn). |
| 5 | **-és ↔ -esa**, con ajuste de tilde. Generaliza las subreglas actuales -glés, -qués, -cés y -nés. | inglés/inglesa; francés/francesa; marqués/marquesa; portugués/portuguesa; holandés/holandesa; irlandés/irlandesa; burgués/burguesa; feligrés/feligresa; burgalés/burgalesa. | Aplicar a gentilicios y nombres de persona flexivos; *arnés*, *revés*, *interés* y el adjetivo invariable *cortés* no autorizan una forma en -esa. |
| 6 | **-o ↔ -a** para nombres animados de dos terminaciones. Incluye familias como -ero/-era, -ario/-aria y -ino/-ina cuando son realmente flexivas. | médico/médica; ingeniero/ingeniera; abogado/abogada; enfermero/enfermera; gato/gata; niño/niña. | Nunca deducir el sentido solo de la última letra: *caso/casa*, *madero/madera* y *soldado/soldada* no son pares masculino/femenino en esas acepciones. |

**Orden técnico:** reconocimiento exacto de excepciones, bloqueos e invariantes conocidos; después sufijos específicos; al final -o/-a. En cada familia, comprobar primero la forma solicitada y luego la forma de origen. Los cambios de acento pertenecen a la regla: portuguesa → portugués, anfitriona → anfitrión y bailarina → bailarín. No se deben quitar tildes de toda la palabra; médico → médica conserva la tilde. La [RAE explica la diferencia entre flexión y semejanza accidental en § 11.2e-f](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf).

Al convertir desde femenino, las terminaciones -ana, -ina y -esa son ambiguas: *hermana* corresponde a *hermano*, mientras que *guardiana* corresponde a *guardián*. El motor habilita un conjunto pequeño de formas masculinas verificadas para restaurar la tilde en esas familias. Las palabras masculinas con -án, -ín o -és siguen usando la regla productiva; la habilitación solo protege la dirección ambigua. Para -ona se exige una raíz mínima y se bloquean las colisiones conocidas.

### Reglas de invariabilidad y familias no productivas

| Grupo | Comportamiento recomendado | Ejemplos y límites |
| --- | --- | --- |
| Nombres de persona en **-ista** | Conservar forma por defecto. | estudiante no termina en -ista; artista, periodista, dentista y taxista sí. *Modisto* existe, pero no autoriza convertir todos los -ista en -isto. [RAE, § 11.4d](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). |
| Nombres de persona en **-ante/-ente** | Conservar forma por defecto; unas pocas voces admiten -anta/-enta. | estudiante, cantante, agente y representante son comunes. cliente/clienta, presidente/presidenta, dependiente/dependienta y sirviente/sirvienta requieren habilitación léxica y política editorial; no una regla universal -nte → -nta. [RAE, § 11.4h-i](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). |
| Nombres en **-a** que son comunes | Conservar forma por defecto. | atleta, astronauta, colega, guía, pediatra y turista sirven para ambos géneros. *Poeta* también puede ser común; *poetisa* depende de la política de uso. [RAE, § 11.4a-e](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). |
| Nombres de persona en **-e**, **-ar/-er**, **-í/-y** | Conservar por defecto. | detective, intérprete, auxiliar, canciller, marroquí y yóquey son comunes. No existe regla universal -e → -a. [RAE, §§ 11.4g y 11.4l-n](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). |
| Nombres en **-l** o **-z** | Conservar por defecto; habilitar solo subclases verificadas. | español/española, colegial/colegiala y andaluz/andaluza flexionan; profesional, capataz y portavoz suelen ser comunes. *Fiscala*, *jueza* y *aprendiza* tienen variación de uso. [RAE, § 11.4ñ-o y § 11.5a](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). |
| **-ense** y compuestos verbo + nombre | Conservar por defecto en el uso pertinente. | costarricense, estadounidense, guardabosques y lavacoches. [RAE: compuestos verbonominales](https://www.rae.es/gram%C3%A1tica/morfolog%C3%ADa/compuestos-verbonominales). |
| Nombres **epicenos** | Conservar el sustantivo; el sexo se expresa fuera de la palabra. | la persona, la víctima, la lechuza, el personaje, el ruiseñor. No generar *persono* ni *ruiseñora*. [RAE, § 11.1d](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). |

**Restricciones léxicas pequeñas, distintas de exceptionPairs.** Las alternancias -e/-a, -nte/-nta, -l/-la y -z/-za no se pueden activar para toda palabra de esa terminación. Conviene registrarlas como perfiles de regla o preferencias editoriales internos, por ejemplo «cliente: admite variante femenina -a» o «fiscal: forma común predeterminada, variante -a según variedad». Esto guarda la *licencia de aplicar una regla*, no un par masculino/femenino calculado a mano. Si el registro crece sin límite, se habrá desplazado el diccionario de archivo y habrá que restringir mejor las reglas; la firma pública seguirá teniendo dos argumentos.

## exceptionPairs: solo pares que no salen de las reglas anteriores

El registro implementado incluye los cinco irregulares originales. Retira médico, abogado, capitán, alemán y catalán porque los resuelven reglas productivas. Mueve cliente/clienta al perfil léxico de -nte/-nta.

~~~ts
const exceptionPairs = [
    // Cinco irregulares ya presentes.
    { masculine: 'actor', feminine: 'actriz' },
    { masculine: 'rey', feminine: 'reina' },
    { masculine: 'héroe', feminine: 'heroína' },
    { masculine: 'emperador', feminine: 'emperatriz' },
    { masculine: 'príncipe', feminine: 'princesa' },

    // Heterónimos: no hay operación sobre un sufijo que los produzca.
    { masculine: 'hombre', feminine: 'mujer' },
    { masculine: 'padre', feminine: 'madre' },
    { masculine: 'papá', feminine: 'mamá' },
    { masculine: 'macho', feminine: 'hembra' },
    { masculine: 'yerno', feminine: 'nuera' },
    { masculine: 'caballo', feminine: 'yegua' },
    { masculine: 'toro', feminine: 'vaca' },
    { masculine: 'carnero', feminine: 'oveja' },
    { masculine: 'patriarca', feminine: 'matriarca' },

    // Cambio de raíz o sufijo idiosincrásico.
    { masculine: 'gallo', feminine: 'gallina' },
    { masculine: 'padrino', feminine: 'madrina' },
    { masculine: 'padrastro', feminine: 'madrastra' },
    { masculine: 'monje', feminine: 'monja' },
    { masculine: 'abad', feminine: 'abadesa' },
    { masculine: 'alcalde', feminine: 'alcaldesa' },
    { masculine: 'barón', feminine: 'baronesa' },
    { masculine: 'conde', feminine: 'condesa' },
    { masculine: 'duque', feminine: 'duquesa' },
    { masculine: 'jeque', feminine: 'jequesa' },
    { masculine: 'zar', feminine: 'zarina' },
] as const;
~~~

El registro contiene **25 pares**. La [RAE enumera heterónimos y formaciones en -esa, -isa e -ina en § 11.2d y § 11.2g-h](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). No se debe convertir el sufijo -esa, -isa, -ina o -triz en una regla inversa universal: *harina*, *piscina* y *directriz* no permiten recuperar un masculino por simple recorte.

Pares válidos que **no se activan por defecto** porque dependen del sentido o de una preferencia editorial: tigre/tigresa (también tigra), poeta/poetisa (también la poeta), profeta/profetisa (también la profeta), jabalí/jabalina (la segunda palabra también nombra un implemento deportivo), sacerdote/sacerdotisa y diácono/diaconisa (cargo religioso dependiente del contexto). La [RAE detalla estas variantes y restricciones en § 11.2g](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf). *Actor/actriz* ya es una excepción del motor, aunque en el ámbito jurídico también se registra *actora*; se debe fijar la acepción si ese uso aparece en el producto.

## blockedNouns: una barrera pequeña, no un inventario de objetos

La lista anterior de 48 objetos propuestos para bloquear **no se recomienda como solución de robustez**. Cada regla nueva puede generar más falsos positivos y una lista completa de objetos sería otro diccionario masivo. Con la API de dos argumentos, los bloqueos deben concentrarse en colisiones frecuentes y en nombres animados que permanecen invariables.

Como protección **de sentido animado** al añadir -o/-a y -or/-ora, sí conviene reconocer unos pocos nombres comunes o epicenos que las reglas amplias podrían alterar: *testigo*, *modelo* (persona), *soldado* (grado militar), *persona*, *víctima*, *criatura*, *lechuza* y *ruiseñor*. En el motor actual podrían almacenarse temporalmente en blockedNouns, pero conceptualmente son «invariables o epicenos» y deberían ir en un registro con ese nombre. [RAE, §§ 11.1d, 11.4k y 11.5b](https://www.rae.es/sites/default/files/sala_prensa_dosier_gramatica_2009.pdf); [DPD: soldado](https://www.rae.es/dpd/soldado).

Además de revisar los bloqueos existentes (*dinero*, *sombrero*, *sector*, *reactor*, *neón*, *padrón*, etc.), estas son **colisiones candidatas** al ampliar las reglas. Deben comprobarse por sentido y con pruebas antes de incorporarlas:

~~~ts
// Coinciden con -és, -án, -ín, -ón, -or o -o/-a sin ser flexiones de género.
'arnés', 'revés', 'interés', 'volcán', 'jardín',
'acordeón', 'panteón', 'sudor', 'ardor',
'caso', 'madero',

// Nombres animados comunes o epicenos que tampoco cambian de forma.
'testigo', 'modelo', 'soldado', 'persona',
'víctima', 'criatura', 'lechuza', 'ruiseñor',
~~~

El motor actual revisa blockedNouns tanto para la entrada como para el resultado. Así, bloquear *caso* también detiene *casa → caso*. Las voces polisémicas [factor/factora](https://dle.rae.es/factor), [florero/florera](https://dle.rae.es/florero) y [llavero/llavera](https://dle.rae.es/llavero) plantean una decisión inevitable con dos argumentos: mantenerlas bloqueadas favorece la seguridad de sus sentidos inanimados, pero impide flexionar sus sentidos humanos. Esta propuesta prioriza la salida sin cambios hasta que el producto tenga un tratamiento específico para esos usos.

## Orden de resolución propuesto

1. Validar género y palabra única; normalizar a NFC y guardar la capitalización.
2. Normalizar «m»/«f» al género interno y consultar bloqueos e invariables conocidos. Si hay coincidencia, devolver la entrada.
3. Aplicar la preferencia editorial configurada internamente para variantes regionales cuando corresponda.
4. Consultar exceptionPairs para los pares irregulares; ninguna forma puede aparecer en dos pares.
5. Aplicar los perfiles léxicos pequeños de las familias restringidas, como -nte/-nta y -e/-a.
6. Aplicar las reglas productivas del más específico al más general, incluida la acentuación de ida y vuelta.
7. Si no hay una regla aplicable, devolver la entrada original; restaurar capitalización al transformar.

No se inventa «neutro» ni se flexionan artículos, sintagmas o plurales con esta API.

## Casos de aceptación

| Grupo | Entradas y resultados esperados |
| --- | --- |
| Regla nueva -és | portugués → portuguesa; portuguesa → portugués; holandés → holandesa; feligresa → feligrés; arnés → arnés. |
| Regla nueva -án | guardián → guardiana; guardiana → guardián; capitán → capitana; volcán → volcán. |
| Regla nueva -ín | bailarín → bailarina; bailarina → bailarín; jardín → jardín. |
| Regla ampliada -ón | anfitrión → anfitriona; anfitriona → anfitrión; peatón → peatona; panteón → panteón. |
| Regla ampliada -or | autor → autora; autora → autor; tutor → tutora; sudor → sudor; ruiseñor → ruiseñor. |
| Regla -o/-a | médico → médica; ingeniera → ingeniero; gato → gata; caso → caso; modelo → modelo; soldado → soldado. |
| Excepciones auténticas | actor → actriz; actriz → actor; barón → baronesa; baronesa → barón; toro → vaca; vaca → toro. |
| Invariantes | estudiante, artista, persona, víctima y portavoz conservan su forma según el sentido pertinente. |
| Aspectos técnicos | Idempotencia, ambas direcciones, mayúsculas, tildes, NFC/NFD, entradas desconocidas y ausencia de colisiones entre registros. |

Las pruebas de objetos y palabras ambiguas deben fijar el **resultado conservador elegido** para esta API de dos argumentos. Conviene probar además la llamada JSX con «m» y «f». Los bloqueos conocidos no garantizan que cualquier objeto desconocido permanezca intacto: esa limitación forma parte explícita del contrato de nombres animados.

**Archivos del motor modificados:** `resources/js/lib/s_cliente.ts`, `resources/js/lib/spanishGenderRules.ts` y `resources/js/lib/spanishGenderExceptions.ts`. **Pruebas ampliadas:** `resources/js/lib/s_cliente.test.ts`.
