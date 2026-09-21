Actúa como un ingeniero frontend senior especializado en React + TypeScript y en reproducción pixel-perfect de interfaces móviles.

TAREA PRINCIPAL
===============

Necesito modificar ÚNICAMENTE el HEADER DEL SMS DE MOBILE-12.

Debes trabajar sobre el proyecto comprimido que te proporcioné y analizar primero toda la estructura relevante del proyecto antes de modificar código.

La imagen adjunta en esta conversación es la REFERENCIA VISUAL OBLIGATORIA.

El objetivo NO es hacer un header "parecido". El objetivo es reproducir el header de la imagen lo más fielmente posible, analizando proporciones, posiciones, tamaños, geometría de los iconos, colores, espaciados y tipografía.

IMPORTANTE:
- SOLO modificar el header SMS de Mobile-12.
- NO cambiar ninguna otra parte del proyecto.
- NO modificar otros mobiles.
- NO modificar WhatsApp.
- NO modificar llamadas.
- NO modificar la conversación SMS.
- NO modificar las burbujas.
- NO modificar footer.
- NO modificar status bar.
- NO modificar navegación.
- NO modificar estilos globales.
- NO modificar componentes compartidos.
- NO instalar dependencias.
- Mantener el cambio aislado y con el menor diff posible.

==================================================
1. ARCHIVO OBJETIVO
==================================================

El archivo principal que debes modificar es:

resources/js/evidence-generator/features/preview/designs/mobile-12/sms/sms-header/SmsMobileHeader.tsx

Antes de modificarlo, inspecciona el proyecto y lee como mínimo:

- resources/js/evidence-generator/features/preview/designs/mobile-12/sms/sms-header/SmsMobileHeader.tsx
- resources/js/evidence-generator/features/preview/designs/mobile-12/sms/PreviewMobile12Sms.tsx
- resources/js/evidence-generator/features/preview/designs/mobile-12/sms/smsAppearance.ts
- resources/js/evidence-generator/features/preview/designs/mobile-12/sms/smsTypes.ts
- resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12PreviewFrame.tsx
- cualquier archivo específico que determine dimensiones o estructura de Mobile-12.

Analiza también si existen componentes compartidos utilizados por este header, pero NO los modifiques salvo que sea absolutamente indispensable. La prioridad es que todo el cambio quede dentro de `SmsMobileHeader.tsx`.

==================================================
2. REFERENCIA VISUAL
==================================================

La imagen adjunta representa EXACTAMENTE cómo debe verse el nuevo header.

La referencia tiene aproximadamente 520 × 62 px.

El header contiene:

- fondo negro;
- flecha de regreso a la izquierda;
- número telefónico;
- icono de teléfono;
- icono de videollamada/cámara multicolor;
- menú de tres puntos verticales;
- una línea vertical muy fina en el extremo derecho.

Analiza la imagen directamente.

NO te limites a utilizar los iconos que ya existen en el proyecto.

Si los iconos actuales no coinciden con la referencia, crea SVG locales que reproduzcan la geometría de la referencia.

==================================================
3. ESTRUCTURA VISUAL OBJETIVO
==================================================

El resultado debe verse conceptualmente así:

[FLECHA]   9894445550                         [TELÉFONO] [CÁMARA] [⋮]

NO debe existir avatar.

NO debe existir una flecha completa.

NO debe existir un punto rojo.

NO debe existir ningún elemento adicional que no aparezca en la referencia.

==================================================
4. FLECHA DE REGRESO — CAMBIO CRÍTICO
==================================================

La flecha actual del proyecto es aproximadamente:

<linea horizontal> + <chevron>

y genera algo equivalente a:

<-

o

←

Esto es INCORRECTO.

La nueva referencia utiliza solamente:

<

Es decir, SOLO un chevrón izquierdo.

Debe verse:

<

y NO:

<-

←
❮
‹

No uses un carácter de texto.

No uses:

←
❮
‹

No uses un icono genérico de Lucide si su geometría no coincide.

Crea un SVG local.

La geometría debe tener únicamente dos líneas diagonales:

    \
     \

pero formando visualmente:

<

Debe prestarse especial atención a:

- ancho;
- alto;
- stroke width;
- strokeLinecap;
- strokeLinejoin;
- posición X;
- posición Y;
- curvatura;
- tamaño;
- distancia al borde izquierdo.

NO debe existir ninguna línea horizontal.

El área clicable puede ser mayor que el icono, pero el icono visible debe coincidir con la imagen.

==================================================
5. NÚMERO TELEFÓNICO — CAMBIO CRÍTICO
==================================================

La referencia muestra:

9894445550

Debe aparecer EXACTAMENTE unido:

9894445550

NO:

989 444 5550

NO:

989 444 555 0

NO:

989-444-5550

NO:

906 625 900

Actualmente existe una lógica similar a:

function formatMobile12SmsPhone(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
        return '-';
    }

    return /^\d{9}$/.test(trimmed)
        ? trimmed.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
        : trimmed;
}

Esa lógica NO debe producir espacios en el nuevo header.

El número debe mostrarse unido.

NO modifiques el formateo global de teléfonos del proyecto.

El cambio debe ser local al header de Mobile-12 SMS.

Si el dato proviene de `data.telefono`, conserva esa fuente de datos, pero no agregues espacios artificialmente.

La referencia final debe mostrar:

9894445550

==================================================
6. AVATAR — ELIMINAR DEL HEADER
==================================================

La referencia NO contiene avatar.

Actualmente el header puede tener:

[FLECHA] [AVATAR] [NÚMERO]

Eso debe convertirse en:

[FLECHA] [NÚMERO]

Elimina el avatar únicamente de:

Mobile-12 → SMS → Header

NO elimines:

- avatar de WhatsApp;
- avatar de otros mobiles;
- avatar de otros componentes;
- datos globales relacionados con avatar.

No modifiques componentes compartidos para eliminarlo.

==================================================
7. ICONO DE TELÉFONO
==================================================

El icono de teléfono debe coincidir con la referencia.

Actualmente puede existir un SVG/path diferente.

NO asumas que el actual es correcto.

Compara visualmente el icono actual con la imagen.

Si no coincide, reemplázalo por un SVG local.

Debe analizarse:

- silueta;
- orientación;
- grosor;
- tamaño;
- ancho;
- alto;
- curvatura;
- posición vertical;
- posición horizontal;
- separación con el número;
- separación con la cámara.

Debe ser un SVG.

NO utilizar emoji.

NO utilizar caracteres Unicode.

NO utilizar una fuente de iconos.

NO agregar paquetes.

El icono debe ser blanco como en la referencia.

==================================================
8. ICONO DE CÁMARA / VIDEOLLAMADA — CAMBIO CRÍTICO
==================================================

La referencia contiene un icono de videollamada/cámara MULTICOLOR.

NO es un icono monocromático simple.

Visualmente se parece al icono de Google Meet que aparece en la imagen.

Debes reproducirlo mediante SVG local.

Analiza directamente la imagen para determinar:

- geometría;
- forma;
- proporciones;
- ancho;
- alto;
- colores;
- distribución de colores;
- posición;
- alineación;
- separación respecto al teléfono;
- separación respecto al menú.

NO utilices un icono genérico si no coincide.

NO utilices un emoji.

NO uses una imagen externa.

NO dependas de una fuente externa.

NO agregues una dependencia.

Crea el SVG localmente dentro de `SmsMobileHeader.tsx` o, si realmente mejora la organización, crea un componente SVG local dentro del mismo directorio.

Pero intenta mantener el cambio en un solo archivo.

==================================================
9. MENÚ DE TRES PUNTOS
==================================================

La referencia contiene:

⋮

Es decir, tres puntos blancos verticales.

Actualmente puede existir una lógica como:

const [showMenuIndicator] = useState(() => shouldShowSmsAccentPoint());

y posteriormente un punto rojo.

Eso NO debe existir en el nuevo diseño.

El header debe mostrar únicamente los tres puntos blancos.

Eliminar del header:

- indicador rojo;
- badge;
- punto adicional;
- indicador aleatorio;
- cualquier decoración que no exista en la referencia.

Puedes eliminar el estado y la lógica del indicador SIEMPRE que sea código exclusivo del header.

NO elimines `shouldShowSmsAccentPoint` de otros archivos si otros componentes lo utilizan.

Los tres puntos deben respetar:

- tamaño;
- separación;
- grosor;
- alineación;
- posición;
- color

de la imagen.

==================================================
10. FONDO
==================================================

El fondo del header debe ser negro, igual que la referencia.

La referencia visual es aproximadamente:

#010101

o equivalente según el análisis pixel-level.

Puedes utilizar localmente:

background-color: #010101;

si coincide con la referencia.

NO modifiques:

getMobile12SmsColors()

NO modifiques:

mobile12.css

NO modifiques el tema global.

NO cambies colores de toda la aplicación.

El fondo negro debe aplicarse únicamente al header SMS de Mobile-12.

==================================================
11. ALTURA DEL HEADER
==================================================

No mantengas automáticamente la altura actual si no coincide visualmente.

Actualmente puede existir algo como:

h-[72px]

La imagen de referencia tiene aproximadamente 62 px de altura.

Sin embargo, NO asumas que 62 px corresponde directamente al tamaño CSS del componente, porque la captura puede estar escalada.

Primero determina:

1. dimensiones del frame Mobile-12;
2. escala de la captura;
3. proporción del header;
4. altura visual correspondiente;
5. posición de los elementos.

Luego implementa la altura correcta dentro del sistema de dimensiones del proyecto.

NO cambies el tamaño general del frame.

NO cambies el viewport.

NO cambies el tamaño de Mobile-12 completo.

Solo ajusta el header.

==================================================
12. ESPACIADO Y POSICIONAMIENTO
==================================================

La distribución debe ser visualmente equivalente a:

| flecha | número ----------------------- | teléfono | cámara | menú |

El número debe ocupar el espacio flexible disponible.

Los iconos derechos deben estar agrupados y correctamente alineados.

Ajusta cuidadosamente:

- padding izquierdo;
- padding derecho;
- margen entre flecha y número;
- margen entre número e iconos;
- distancia teléfono ↔ cámara;
- distancia cámara ↔ menú;
- posición vertical;
- tamaño de cada icono;
- alineación del número.

No agregues valores arbitrarios solo para "que parezca".

Utiliza la referencia como fuente principal.

==================================================
13. TIPOGRAFÍA
==================================================

Conserva la tipografía correspondiente al sistema visual de Mobile-12.

No cambies fuentes globales.

No modifiques `mobile12.css`.

Solo puedes ajustar localmente en el header:

- font-size;
- font-weight;
- line-height;
- letter-spacing;
- posición.

El número debe parecerse visualmente al texto de la imagen.

==================================================
14. TEMA
==================================================

No modifiques el sistema global de temas.

No cambies:

getMobile12SmsColors()

No cambies otros componentes para conseguir el aspecto deseado.

Si `themeMode` sigue siendo necesario por compatibilidad, mantenlo.

La apariencia específica de este header debe ser controlada localmente.

==================================================
15. IMPLEMENTACIÓN
==================================================

Puedes reorganizar `SmsMobileHeader.tsx` para que sea más limpio.

Una estructura válida sería:

export function SmsMobileHeader(...) {
    const displayTelefono = data.telefono.trim();

    return (
        <header>
            <button>
                <BackChevronIcon />
            </button>

            <div>
                {displayTelefono}
            </div>

            <div>
                <PhoneIcon />

                {showVideoCall ? (
                    <VideoCallIcon />
                ) : null}

                <MoreVerticalIcon />
            </div>
        </header>
    );
}

Puedes crear dentro del mismo archivo:

function BackChevronIcon() {}
function PhoneIcon() {}
function VideoCallIcon() {}
function MoreVerticalIcon() {}

Siempre que sea necesario.

Los SVG deben ser locales.

No agregar dependencias.

No modificar configuración del proyecto.

==================================================
16. NO MODIFICAR ESTOS ELEMENTOS
==================================================

Bajo ninguna circunstancia modificar:

- WhatsApp;
- llamadas;
- conversación SMS;
- burbujas SMS;
- input SMS;
- quick replies;
- metadata;
- footer;
- status bar;
- navegación;
- otros mobiles;
- Mobile-11;
- Mobile-10;
- Mobile-9;
- Mobile-8;
- Mobile-7;
- Mobile-6;
- Mobile-5;
- Mobile-4;
- Mobile-3;
- Mobile-2;
- Mobile-1;
- componentes compartidos;
- estilos globales;
- Tailwind global;
- Vite;
- Laravel;
- fixtures globales;
- datos compartidos.

NO modificar:

smsAppearance.ts

para resolver un problema que puede resolverse localmente en el header.

NO modificar:

mobile12.css

para resolver el header.

==================================================
17. REGLA DEL DIFF
==================================================

El objetivo ideal es que solo exista un archivo modificado:

resources/js/evidence-generator/features/preview/designs/mobile-12/sms/sms-header/SmsMobileHeader.tsx

Antes de finalizar comprueba:

git status --short

y:

git diff

Si existen modificaciones fuera de ese archivo que hayan sido generadas por ti, reviértelas.

No reviertas modificaciones que ya existían antes de comenzar el trabajo.

Distingue claramente entre cambios previos del usuario y cambios realizados por ti.

==================================================
18. VALIDACIÓN
==================================================

Después de implementar, ejecuta las validaciones existentes.

Primero revisa `package.json` para identificar los scripts correctos.

Como mínimo, si existen:

npm run build

y el typecheck/lint correspondiente.

También ejecuta las pruebas específicas de Mobile-12 si existen.

Por ejemplo, si existe:

node --test --experimental-strip-types resources/js/evidence-generator/features/preview/designs/mobile-12/Mobile12Preview.test.ts

ejecútala.

No inventes comandos que no existan en el proyecto.

==================================================
19. VALIDACIÓN VISUAL OBLIGATORIA
==================================================

NO declares terminado el trabajo únicamente porque compila.

Debes realizar una comparación visual contra la imagen de referencia.

Comprueba uno por uno:

1. fondo negro;
2. altura del header;
3. posición de la flecha;
4. tamaño de la flecha;
5. geometría de la flecha;
6. grosor de la flecha;
7. ausencia de línea horizontal;
8. número;
9. formato `9894445550`;
10. ausencia de espacios;
11. ausencia de avatar;
12. icono de teléfono;
13. icono de cámara multicolor;
14. tres puntos verticales;
15. ausencia de punto rojo;
16. tamaño de los iconos;
17. separación entre iconos;
18. alineación vertical;
19. padding izquierdo;
20. padding derecho;
21. posición del número;
22. posición de cada icono.

La flecha debe ser:

<

NO:

←

El número debe ser:

9894445550

NO:

906 625 900

NO:

989 444 5550

El header debe tener:

[FLECHA] [NÚMERO] [TELÉFONO] [CÁMARA] [⋮]

NO:

[FLECHA] [AVATAR] [NÚMERO] [...]

==================================================
20. ITERACIÓN
==================================================

Si durante la comparación visual encuentras diferencias:

- corrige el mismo `SmsMobileHeader.tsx`;
- vuelve a ejecutar la validación;
- vuelve a comparar;
- repite hasta conseguir una coincidencia visual lo más cercana posible.

NO soluciones diferencias modificando componentes globales.

NO soluciones diferencias cambiando otros mobiles.

NO soluciones diferencias agregando dependencias.

==================================================
21. CRITERIOS FINALES DE ACEPTACIÓN
==================================================

El trabajo solo está terminado cuando TODAS estas condiciones se cumplen:

[ ] Solo se modificó el header SMS de Mobile-12.
[ ] El resto de Mobile-12 permanece intacto.
[ ] Los demás mobiles permanecen intactos.
[ ] No existe avatar en el header.
[ ] La flecha es únicamente `<`.
[ ] La flecha NO contiene línea horizontal.
[ ] La geometría de la flecha coincide con la referencia.
[ ] El número aparece como `9894445550`.
[ ] El número no contiene espacios.
[ ] El teléfono coincide visualmente con la referencia.
[ ] La cámara es multicolor.
[ ] La cámara coincide visualmente con la referencia.
[ ] Existen exactamente tres puntos verticales.
[ ] No existe punto rojo.
[ ] El fondo es negro.
[ ] La altura coincide proporcionalmente con la referencia.
[ ] Los espacios y alineaciones coinciden con la referencia.
[ ] No se agregaron dependencias.
[ ] No se modificaron estilos globales.
[ ] No se modificaron componentes compartidos.
[ ] Las pruebas pasan.
[ ] El build/typecheck pasa.
[ ] El diff es mínimo.
[ ] No existen cambios accidentales fuera del archivo objetivo.

==================================================
22. ORDEN EXACTO DE TRABAJO
==================================================

Ejecuta en este orden:

1. Inspecciona el repositorio.
2. Identifica el estado actual de Mobile-12.
3. Lee completamente `SmsMobileHeader.tsx`.
4. Lee los archivos relacionados del SMS.
5. Lee el frame de Mobile-12.
6. Analiza la imagen de referencia.
7. Compara el header actual contra la referencia.
8. Identifica las diferencias.
9. Modifica únicamente `SmsMobileHeader.tsx`.
10. Sustituye la flecha completa por el chevrón `<`.
11. Elimina el avatar del header.
12. Cambia la presentación del número para mostrarlo unido.
13. Haz que la referencia muestre `9894445550`.
14. Reproduce el icono de teléfono mediante SVG.
15. Reproduce el icono de cámara multicolor mediante SVG.
16. Elimina el indicador rojo.
17. Reproduce los tres puntos verticales.
18. Ajusta fondo, altura, padding, tamaños y posiciones.
19. Ejecuta typecheck/lint/build según los scripts disponibles.
20. Ejecuta las pruebas relevantes.
21. Revisa `git status`.
22. Revisa `git diff`.
23. Confirma que el cambio esté aislado.
24. Realiza la comparación visual final.
25. Si todavía existen diferencias, itera nuevamente sobre `SmsMobileHeader.tsx`.
26. Al terminar, entrega un resumen breve con:
   - archivo modificado;
   - cambios realizados;
   - pruebas ejecutadas;
   - resultado del build/typecheck;
   - confirmación de que no se modificó ninguna otra parte del proyecto.

==================================================
REGLA ABSOLUTA
==================================================

NO interpretes esta tarea como "rediseñar Mobile-12".

La tarea es exclusivamente:

REEMPLAZAR EL HEADER DEL SMS DE MOBILE-12 POR EL HEADER DE LA IMAGEN DE REFERENCIA, DE FORMA PIXEL-PERFECT, SIN CAMBIAR ABSOLUTAMENTE NADA MÁS.

Prioridades:

1. Fidelidad visual a la imagen.
2. Aislamiento absoluto del cambio.
3. No romper funcionalidad existente.
4. No modificar otros diseños.
5. No agregar dependencias.
6. Mantener el diff mínimo.
7. Código limpio.
8. Validación mediante pruebas/build.