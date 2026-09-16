# Diseño: réplica independiente de mobile-1 como mobile-11

## Objetivo

Agregar `mobile-11` como un diseño seleccionable y registrado, replicando visualmente `mobile-1` en WhatsApp, SMS y llamadas, en modo claro y oscuro. La implementación de `mobile-11` debe tener componentes y archivos propios; ningún componente de `mobile-11` importará directamente desde la carpeta `mobile-1`.

## Arquitectura

- Crear `resources/js/evidence-generator/features/preview/designs/mobile-11/` con la misma cobertura funcional que `mobile-1` para los tres canales.
- Copiar y renombrar los componentes, adaptadores, tipos y utilidades específicas de `mobile-1` para que sus imports internos apunten a `mobile-11` o a módulos compartidos ya existentes.
- Registrar los previews de WhatsApp, SMS y llamadas en `mobilePreviewProfiles.tsx`, usando el registry existente.
- Extender `MobileDesignKey` y `MobileDesignCatalog` con `mobile-11`.
- Crear una migración nueva que registre `mobile-11` con `firstOrCreate` y que impida el rollback mientras existan registros que lo utilicen, siguiendo la migración de `mobile-10`.
- Actualizar los listados, perfiles y tipos derivados que requieran conocer la nueva clave.

## Paridad visual y aislamiento

La copia conservará estructura, estilos Tailwind, colores, tipografía, chrome del dispositivo, estados claro/oscuro, comportamiento de mensajes, SMS y llamadas de `mobile-1`. Las referencias explícitas a `mobile-1` dentro de la nueva carpeta se eliminarán o se sustituirán por implementaciones locales. Las dependencias verdaderamente compartidas permanecerán en `designs/shared`.

No se cambiará el comportamiento ni la apariencia de `mobile-1`. La selección de `mobile-11` deberá resolver a sus propios componentes desde el registry y no mediante imports directos desde `mobile-1`.

## Pruebas y verificación

- Agregar pruebas estructurales para comprobar que existe la carpeta completa de `mobile-11`, que el registry contiene sus tres canales y que no hay imports desde `mobile-1` dentro de ella.
- Añadir o adaptar pruebas de paridad que comparen la configuración visual de `mobile-11` con la de `mobile-1` para ambos temas y los tres canales, según el mecanismo de snapshots o hashes ya existente.
- Ejecutar las pruebas TypeScript/Vitest afectadas y las pruebas Laravel relacionadas con catálogo, registro y configuración.
- Ejecutar Pint si se modifican archivos PHP.

## Fuera de alcance

- No modificar el diseño visual de `mobile-1`.
- No cambiar dependencias del proyecto.
- No crear documentación adicional fuera de esta especificación.
