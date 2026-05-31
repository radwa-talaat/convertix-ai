"use client";

import * as React from "react";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastContextValue = {
  toast: (toast: Omit<Toast, "id">) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback(
    (toastInput: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [{ id, ...toastInput }, ...current].slice(0, 3));
      window.setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  const value = React.useMemo(
    () => ({ dismiss, toast, toasts }),
    [dismiss, toast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
