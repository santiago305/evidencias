import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";

interface ConversationDraftMessage {
  id: string;
  side: "in" | "out";
  linesText: string;
}

export interface NewConversationPayload {
  code: string;
  total_minutes: number;
  messages: Array<{
    side: "in" | "out";
    lines: string[];
  }>;
}

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: NewConversationPayload) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
  defaultTotalMinutes: string;
}

const createMessageId = () => Math.random().toString(36).slice(2);

const createEmptyMessage = (): ConversationDraftMessage => ({
  id: createMessageId(),
  side: "out",
  linesText: "",
});

export function NewConversationModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  errorMessage,
  defaultTotalMinutes,
}: NewConversationModalProps) {
  const [code, setCode] = useState("");
  const [totalMinutes, setTotalMinutes] = useState(defaultTotalMinutes);
  const [messages, setMessages] = useState<ConversationDraftMessage[]>([
    createEmptyMessage(),
  ]);
  const [collapsedMessages, setCollapsedMessages] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (open) {
      setTotalMinutes(defaultTotalMinutes);
    }
  }, [defaultTotalMinutes, open]);

  const minimumRequiredMinutes = Math.max(0, (messages.length - 1) * 6);
  const parsedTotalMinutes = Number(totalMinutes);
  const hasValidTotalMinutes =
    totalMinutes.trim() !== "" &&
    Number.isFinite(parsedTotalMinutes) &&
    Number.isInteger(parsedTotalMinutes) &&
    parsedTotalMinutes >= minimumRequiredMinutes;

  const totalMinutesError =
    totalMinutes.trim() === ""
      ? "Ingresa el tiempo total."
      : Number.isFinite(parsedTotalMinutes) &&
          Number.isInteger(parsedTotalMinutes) &&
          parsedTotalMinutes < minimumRequiredMinutes
        ? `Necesitas al menos ${minimumRequiredMinutes} min para ${messages.length} mensajes.`
        : null;

  const canSubmit = useMemo(() => {
    return (
      code.trim() !== "" &&
      hasValidTotalMinutes &&
      messages.length > 0 &&
      messages.every((message) => message.linesText.trim() !== "")
    );
  }, [code, hasValidTotalMinutes, messages]);

  const updateMessage = (
    id: string,
    patch: Partial<ConversationDraftMessage>,
  ) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === id ? { ...message, ...patch } : message,
      ),
    );
  };

  const addMessage = () => {
    setMessages((previous) => [...previous, createEmptyMessage()]);
  };

  const removeMessage = (id: string) => {
    setMessages((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter((message) => message.id !== id);
    });

    setCollapsedMessages((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  };

  const toggleCollapsed = (id: string) => {
    setCollapsedMessages((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const resetForm = () => {
    setCode("");
    setTotalMinutes(defaultTotalMinutes);
    setMessages([createEmptyMessage()]);
    setCollapsedMessages({});
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    const payload: NewConversationPayload = {
      code: code.trim(),
      total_minutes: Math.max(0, Number(totalMinutes) || 0),
      messages: messages.map((message) => ({
        side: message.side,
        lines: message.linesText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      })),
    };

    await onSubmit(payload);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-100 px-5 py-4">
          <DialogTitle className="text-base font-semibold text-slate-900">
            Nueva conversacion
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[72vh] overflow-y-auto px-5 py-4">
          <div className="mb-4">
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Codigo de conversacion"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Tiempo total a repartir (min)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={totalMinutes}
              onChange={(event) => setTotalMinutes(event.target.value)}
              placeholder="Ej: 30"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Minimo requerido: {minimumRequiredMinutes} min para{" "}
              {messages.length} mensajes.
            </p>
            {totalMinutesError ? (
              <p className="mt-1 text-[11px] text-red-600">{totalMinutesError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            {messages.map((message, index) => {
              const isCollapsed = Boolean(collapsedMessages[message.id]);

              const firstLine =
                message.linesText
                  .split("\n")
                  .map((line) => line.trim())
                  .find(Boolean) || "Sin mensaje";

              return (
                <div
                  key={message.id}
                  className="rounded-lg border border-slate-200 bg-white"
                >
                  <div className="flex items-center gap-2 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(message.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {isCollapsed ? "+" : "-"}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCollapsed(message.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          Mensaje {index + 1}
                        </span>

                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {message.side === "out" ? "Asesor" : "Cliente"}
                        </span>
                      </div>

                      {isCollapsed ? (
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {firstLine}
                        </p>
                      ) : null}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeMessage(message.id)}
                      disabled={messages.length === 1}
                      className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Eliminar
                    </button>
                  </div>

                  {!isCollapsed ? (
                    <div className="border-t border-slate-100 p-3 pt-2">
                      <div className="mb-2 flex items-center gap-2">
                        <select
                          value={message.side}
                          onChange={(event) =>
                            updateMessage(message.id, {
                              side: event.target.value as "in" | "out",
                            })
                          }
                          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-slate-400"
                        >
                          <option value="out">Asesor</option>
                          <option value="in">Cliente</option>
                        </select>
                      </div>

                      <textarea
                        value={message.linesText}
                        onChange={(event) =>
                          updateMessage(message.id, {
                            linesText: event.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Escribe el mensaje..."
                        className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addMessage}
            className="mt-3 w-full rounded-md border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
          >
            + Agregar mensaje
          </button>

          {errorMessage ? (
            <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <DialogFooter className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
