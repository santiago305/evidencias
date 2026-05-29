import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";

interface ConversationDraftMessage {
  side: "in" | "out";
  delayMinutes: number;
  linesText: string;
}

export interface NewConversationPayload {
  code: string;
  messages: Array<{
    side: "in" | "out";
    delay_minutes: number;
    lines: string[];
  }>;
}

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: NewConversationPayload) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

const createEmptyMessage = (): ConversationDraftMessage => ({
  side: "out",
  delayMinutes: 0,
  linesText: "",
});

export function NewConversationModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  errorMessage,
}: NewConversationModalProps) {
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState<ConversationDraftMessage[]>([
    createEmptyMessage(),
  ]);

  const canSubmit = useMemo(() => {
    return (
      code.trim() !== "" &&
      messages.length > 0 &&
      messages.every((message) => message.linesText.trim() !== "")
    );
  }, [code, messages]);

  const updateMessage = (
    index: number,
    patch: Partial<ConversationDraftMessage>
  ) => {
    setMessages((previous) =>
      previous.map((message, currentIndex) =>
        currentIndex === index ? { ...message, ...patch } : message
      )
    );
  };

  const addMessage = () => {
    setMessages((previous) => [...previous, createEmptyMessage()]);
  };

  const removeMessage = (index: number) => {
    setMessages((previous) =>
      previous.length === 1
        ? previous
        : previous.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleSubmit = async () => {
    const payload: NewConversationPayload = {
      code: code.trim(),
      messages: messages.map((message) => ({
        side: message.side,
        delay_minutes: Math.max(0, Number(message.delayMinutes) || 0),
        lines: message.linesText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      })),
    };

    await onSubmit(payload);
    setCode("");
    setMessages([createEmptyMessage()]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nueva conversación</DialogTitle>
          <DialogDescription>
            Registra manualmente una conversación para que el sistema la use al
            generar evidencias.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-1">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Código</span>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Ej: conv_020"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="grid gap-3">
            {messages.map((message, index) => (
              <div
                key={`message-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-slate-700">Lado</span>
                    <select
                      value={message.side}
                      onChange={(event) =>
                        updateMessage(index, {
                          side: event.target.value as "in" | "out",
                        })
                      }
                      className="rounded-lg border border-slate-300 px-2 py-2"
                    >
                      <option value="out">Asesor (out)</option>
                      <option value="in">Cliente (in)</option>
                    </select>
                  </label>

                  <label className="grid gap-1 text-sm">
                    <span className="font-medium text-slate-700">
                      Delay (min)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={message.delayMinutes}
                      onChange={(event) =>
                        updateMessage(index, {
                          delayMinutes: Number(event.target.value),
                        })
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>

                  <div className="md:col-span-2 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeMessage(index)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      disabled={messages.length === 1}
                    >
                      Eliminar bloque
                    </button>
                  </div>
                </div>

                <label className="mt-3 grid gap-1 text-sm">
                  <span className="font-medium text-slate-700">
                    Líneas (una por renglón)
                  </span>
                  <textarea
                    value={message.linesText}
                    onChange={(event) =>
                      updateMessage(index, { linesText: event.target.value })
                    }
                    rows={4}
                    placeholder="Ej: {saludo}, Sr(a). {cliente}."
                    className="rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMessage}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            + Agregar bloque de mensaje
          </button>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar conversación"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
