import type { RowProps } from "../../../types";

// Componente que pinta una fila clave valor del resumen.
export function Row({ k, v, themeMode = "light" }: RowProps) {
  const isDark = themeMode === "dark";

  return (
    <div className={["flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 shadow-sm", isDark ? "border-white/10 bg-slate-800" : "border-slate-200 bg-white"].join(" ")}>
      <span className={["text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-700"].join(" ")}>{k}</span>
      <span className={["max-w-[60%] truncate text-xs", isDark ? "text-white" : "text-slate-900"].join(" ")}>
        {v?.trim() ? v : "-"}
      </span>
    </div>
  );
}
