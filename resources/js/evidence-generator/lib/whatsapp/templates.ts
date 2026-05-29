import { defaultAdvisorSignature } from "../../config/whatsapp/signature";
import { defaultTemplateValues } from "../../config/whatsapp/templateDefaults";

export function interpolateTemplate(text: string, values: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    return values[key] ?? `{${key}}`;
  });
}

export function getFirstName(fullName: string) {
  const cleaned = fullName.trim();
  if (!cleaned) return "";
  return cleaned.split(/\s+/)[0] ?? "";
}

export function buildWhatsappTemplateValues({
  nombreCliente,
  nombreAsesor,
  saludo,
  tramo,
  montoFormateado,
}: {
  nombreCliente: string;
  nombreAsesor: string;
  saludo: string;
  tramo: string;
  montoFormateado: string | null;
}) {
  const nombreAsesorFirst = getFirstName(nombreAsesor) || "Maria";

  return {
    asesor: nombreAsesorFirst,
    asesor_nombre: nombreAsesor,
    cliente: nombreCliente,
    firma: defaultAdvisorSignature,
    saludo,
    tramo,
    monto:
      montoFormateado ?? defaultTemplateValues.monto_formateado,
    monto_formateado:
      montoFormateado ?? defaultTemplateValues.monto_formateado,
  };
}
