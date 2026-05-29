import informativoApuradoRespuestaData from "../../data/modos/informativo/apurado/respuestaClienteInicial.json";
import informativoConversadorRespuestaData from "../../data/modos/informativo/conversador/respuestaClienteInicial.json";
import informativoDesconfiadoRespuestaData from "../../data/modos/informativo/desconfiado/respuestaClienteInicial.json";
import informativoFrioRespuestaData from "../../data/modos/informativo/frio/respuestaClienteInicial.json";
import informativoIndecisoRespuestaData from "../../data/modos/informativo/indeciso/respuestaClienteInicial.json";
import informativoMensajeData from "../../data/modos/informativo/mensajeEntrada.json";
import informativoSerenoRespuestaData from "../../data/modos/informativo/sereno/respuestaClienteInicial.json";
import contactadoApuradoRespuestaData from "../../data/modos/contactado/apurado/respuestaClienteInicial.json";
import contactadoConversadorRespuestaData from "../../data/modos/contactado/conversador/respuestaClienteInicial.json";
import contactadoDesconfiadoRespuestaData from "../../data/modos/contactado/desconfiado/respuestaClienteInicial.json";
import contactadoFrioRespuestaData from "../../data/modos/contactado/frio/respuestaClienteInicial.json";
import contactadoIndecisoRespuestaData from "../../data/modos/contactado/indeciso/respuestaClienteInicial.json";
import contactadoMensajeData from "../../data/modos/contactado/mensajeEntrada.json";
import contactadoSerenoRespuestaData from "../../data/modos/contactado/sereno/respuestaClienteInicial.json";
import type { ModoEntrada, TipoCliente } from "../../types";
import { clientProfileConfigMap } from "./clientProfiles";

export const modoEntradaOptions: {
  value: ModoEntrada;
  label: string;
  description: string;
}[] = [
  {
    value: "informativo",
    label: "Informativo",
    description: "Primer contacto o mensaje general.",
  },
  {
    value: "contactado",
    label: "Contactado",
    description: "Ya hubo contacto previo con el cliente.",
  },
] as const;

export interface WhatsappInitialResponseOption {
  tipo: string;
  respuestas: Array<string | string[]>;
}

export interface WhatsappConversationModeConfig {
  mensajeEntrada: string[][];
  respuestaClienteInicial: WhatsappInitialResponseOption[];
  durationMinutes: {
    min: number;
    max: number;
  };
}

const conversationModeConfigMap: Record<
  ModoEntrada,
  Record<TipoCliente, Omit<WhatsappConversationModeConfig, "durationMinutes">>
> = {
  informativo: {
    apurado: {
      mensajeEntrada: informativoMensajeData,
      respuestaClienteInicial: informativoApuradoRespuestaData,
    },
    sereno: {
      mensajeEntrada: informativoMensajeData,
      respuestaClienteInicial: informativoSerenoRespuestaData,
    },
    desconfiado: {
      mensajeEntrada: informativoMensajeData,
      respuestaClienteInicial: informativoDesconfiadoRespuestaData,
    },
    frio: {
      mensajeEntrada: informativoMensajeData,
      respuestaClienteInicial: informativoFrioRespuestaData,
    },
    conversador: {
      mensajeEntrada: informativoMensajeData,
      respuestaClienteInicial: informativoConversadorRespuestaData,
    },
    indeciso: {
      mensajeEntrada: informativoMensajeData,
      respuestaClienteInicial: informativoIndecisoRespuestaData,
    },
  },
  contactado: {
    apurado: {
      mensajeEntrada: contactadoMensajeData,
      respuestaClienteInicial: contactadoApuradoRespuestaData,
    },
    sereno: {
      mensajeEntrada: contactadoMensajeData,
      respuestaClienteInicial: contactadoSerenoRespuestaData,
    },
    desconfiado: {
      mensajeEntrada: contactadoMensajeData,
      respuestaClienteInicial: contactadoDesconfiadoRespuestaData,
    },
    frio: {
      mensajeEntrada: contactadoMensajeData,
      respuestaClienteInicial: contactadoFrioRespuestaData,
    },
    conversador: {
      mensajeEntrada: contactadoMensajeData,
      respuestaClienteInicial: contactadoConversadorRespuestaData,
    },
    indeciso: {
      mensajeEntrada: contactadoMensajeData,
      respuestaClienteInicial: contactadoIndecisoRespuestaData,
    },
  },
};

export function getWhatsappConversationModeConfig(
  modoEntrada: ModoEntrada | undefined,
  tipoCliente: TipoCliente | undefined
) {
  const safeModoEntrada = modoEntrada ?? "informativo";
  const safeTipoCliente = tipoCliente ?? "sereno";
  const modeConfig =
    conversationModeConfigMap[safeModoEntrada][safeTipoCliente];

  return {
    ...modeConfig,
    durationMinutes: clientProfileConfigMap[safeTipoCliente].durationMinutes,
  };
}

export function pickRandomModoEntrada(randomValue = Math.random()) {
  const safeRandomValue =
    randomValue >= 0 && randomValue < 1 ? randomValue : Math.random();
  const index = Math.floor(safeRandomValue * modoEntradaOptions.length);

  return modoEntradaOptions[index]?.value ?? "informativo";
}
