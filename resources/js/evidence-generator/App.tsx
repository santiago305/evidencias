import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { FormPanel } from "./features/editor/components/FormPanel";
import { PreviewPanel } from "./features/preview/components/PreviewPanel";
import { pickRandomClientProfile } from "./config/whatsapp/clientProfiles";
import {
  pickRandomModoEntrada,
} from "./config/whatsapp/conversationModes";
import type {
  ActiveDesign,
  ConversationProgressSummary,
  FormState,
  GeneratedMessage,
  SavedData,
} from "./types";
import { getJson, postJson } from "./lib/api";
import {
  NewConversationModal,
  type NewConversationPayload,
} from "./features/conversations/components/NewConversationModal";
import { useEffect } from "react";

interface ConversationsIndexResponse {
  data: Array<{ id: number; code: string }>;
}

interface GenerateEvidenceResponse {
  conversationId: string;
  seedCode: string;
  messages: GeneratedMessage[];
  progress: ConversationProgressSummary;
}

/* ---------------- App ---------------- */
// Componente raiz que coordina estado, tabs y vistas.
export default function App() {
  const [activeDesign, setActiveDesign] = useState<ActiveDesign>("whatsapp");
  const [form, setForm] = useState<FormState>({
    nombreAsesor: "",
    dni: "",
    telefono: "",
    nombre: "",
    monto: "",
    tasa: "",
    cuota: "",
    plazo: "",
    fechaHora: "",
    duracion: "",
    modoEntrada: "informativo",
  });

  const [saved, setSaved] = useState<SavedData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSeedCode, setGeneratedSeedCode] = useState("");
  const [seedCodeInput, setSeedCodeInput] = useState("");
  const [progress, setProgress] = useState<ConversationProgressSummary | null>(
    null
  );
  const [conversationsCount, setConversationsCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [isSavingConversation, setIsSavingConversation] = useState(false);
  const [conversationModalError, setConversationModalError] = useState<
    string | null
  >(null);

  const handleChange =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const loadConversations = async () => {
    try {
      const response = await getJson<ConversationsIndexResponse>(
        route("conversations.index")
      );
      setConversationsCount(response.data.length);
    } catch {
      setFeedbackMessage("No se pudo cargar el listado de conversaciones.");
    }
  };

  useEffect(() => {
    void loadConversations();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setFeedbackMessage(null);

    try {
      const response = await postJson<GenerateEvidenceResponse>(
        route("evidences.generate"),
        {
          ...form,
          ...(seedCodeInput.trim() !== "" ? { seedCode: seedCodeInput.trim() } : {}),
        }
      );

      setSaved({
        ...form,
        modoEntrada: pickRandomModoEntrada(),
        tipoCliente: pickRandomClientProfile(),
        conversationId: response.conversationId,
        seedCode: response.seedCode,
        generatedMessages: response.messages,
        progress: response.progress,
      });
      setGeneratedSeedCode(response.seedCode);
      setProgress(response.progress);
      setFeedbackMessage(`Conversación usada: ${response.conversationId}`);
    } catch (error) {
      const errorPayload = error as {
        errors?: Record<string, string[]>;
        message?: string;
      };
      const firstError =
        errorPayload?.errors &&
        Object.values(errorPayload.errors)[0] &&
        Object.values(errorPayload.errors)[0][0];

      setFeedbackMessage(firstError ?? errorPayload?.message ?? "No se pudo generar la evidencia.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateConversation = async (payload: NewConversationPayload) => {
    setIsSavingConversation(true);
    setConversationModalError(null);

    try {
      await postJson(route("conversations.store"), payload);
      setIsConversationModalOpen(false);
      setFeedbackMessage(`Conversación ${payload.code} guardada correctamente.`);
      await loadConversations();
    } catch (error) {
      const errorPayload = error as {
        errors?: Record<string, string[]>;
        message?: string;
      };
      const firstError =
        errorPayload?.errors &&
        Object.values(errorPayload.errors)[0] &&
        Object.values(errorPayload.errors)[0][0];

      setConversationModalError(
        firstError ?? errorPayload?.message ?? "No se pudo guardar la conversación."
      );
    } finally {
      setIsSavingConversation(false);
    }
  };

  const tabItems = useMemo(
    () =>
      [
        { key: "whatsapp" as const, label: "WhatsApp", accent: "bg-emerald-600" },
        { key: "llamada" as const, label: "Llamada", accent: "bg-sky-600" },
        { key: "sms" as const, label: "SMS", accent: "bg-indigo-600" },
      ] as const,
    []
  );

  return (
    <div className="h-screen w-full bg-slate-50">
      <div className="w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 h-full">
          <PreviewPanel activeDesign={activeDesign} saved={saved} />
          <FormPanel
            activeDesign={activeDesign}
            form={form}
            saved={saved}
            tabItems={tabItems}
            onSelectDesign={setActiveDesign}
            onChange={handleChange}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generatedSeedCode={generatedSeedCode}
            seedCodeInput={seedCodeInput}
            onSeedCodeInputChange={setSeedCodeInput}
            progress={progress}
            conversationsCount={conversationsCount}
            onOpenConversationModal={() => {
              setConversationModalError(null);
              setIsConversationModalOpen(true);
            }}
            feedbackMessage={feedbackMessage}
          />
        </div>
      </div>

      <NewConversationModal
        open={isConversationModalOpen}
        onOpenChange={(open) => {
          setIsConversationModalOpen(open);
          if (!open) {
            setConversationModalError(null);
          }
        }}
        onSubmit={handleCreateConversation}
        isSubmitting={isSavingConversation}
        errorMessage={conversationModalError}
      />
    </div>
  );
}
