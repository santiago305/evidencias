export type AppRuntime = "deploy" | "production";

const rawAppRuntime = import.meta.env.VITE_APP?.trim().toLowerCase();

export const appRuntime: AppRuntime =
  rawAppRuntime === "production" ? "production" : "deploy";

export const showManualConversationControls = appRuntime === "deploy";
