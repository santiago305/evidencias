import type { PreviewBlockProps } from "../../../types";
import { EmptyState } from "./EmptyState";
import { MobilePreviewFrame } from "./MobilePreviewFrame";
import { Row } from "./Row";

// Componente que agrupa el resumen guardado en el preview.
export function PreviewBlock({ title, badge, data, themeMode }: PreviewBlockProps) {
  if (!data) return <EmptyState />;

  const isDark = themeMode === "dark";

  return (
    <MobilePreviewFrame title={title} subtitle="Evidencia movil" themeMode={themeMode}>
      <div className={["h-full overflow-y-auto", isDark ? "bg-slate-900" : "bg-slate-50"].join(" ")}>
        {/* top bar */}
        <div className={["flex items-center justify-between border-b px-4 py-3", isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-white"].join(" ")}>
          <div>
            <div className={["text-sm font-bold", isDark ? "text-white" : "text-slate-900"].join(" ")}>{title}</div>
            <div className={["text-xs", isDark ? "text-slate-400" : "text-slate-500"].join(" ")}>Resumen del registro guardado</div>
          </div>
          <span className={["rounded-full px-3 py-1 text-[11px] font-semibold", isDark ? "bg-white text-slate-950" : "bg-slate-900 text-white"].join(" ")}>
            {badge}
          </span>
        </div>

        {/* content */}
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-1 gap-2">
            <Row k="Nombre de asesor" v={data.nombreAsesor} themeMode={themeMode} />
            <Row k="DNI" v={data.dni} themeMode={themeMode} />
            <Row k="Telefono" v={data.telefono} themeMode={themeMode} />
            <Row k="Nombre" v={data.nombre} themeMode={themeMode} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Row k="Monto" v={data.monto} themeMode={themeMode} />
            <Row k="Tasa" v={data.tasa} themeMode={themeMode} />
            <Row k="Cuota" v={data.cuota} themeMode={themeMode} />
            <Row k="Plazo" v={data.plazo} themeMode={themeMode} />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Row k="Fecha/Hora" v={data.fechaHora} themeMode={themeMode} />
            <Row k="Duracion (min)" v={data.duracion} themeMode={themeMode} />
          </div>
        </div>
      </div>
    </MobilePreviewFrame>
  );
}
