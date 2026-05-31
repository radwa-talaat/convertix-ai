"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { dismiss, toasts } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastPrimitive.Root
          className={cn(
            "grid w-full max-w-sm grid-cols-[1fr_auto] items-start gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-luxury-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            toast.variant === "destructive" &&
              "border-destructive/30 bg-destructive text-destructive-foreground",
          )}
          key={toast.id}
        >
          <div>
            <ToastPrimitive.Title className="text-sm font-semibold">
              {toast.title}
            </ToastPrimitive.Title>
            {toast.description ? (
              <ToastPrimitive.Description className="mt-1 text-sm opacity-85">
                {toast.description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          <ToastPrimitive.Close
            className="rounded-md opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => dismiss(toast.id)}
          >
            <X className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-[calc(100%-2rem)] flex-col gap-2 sm:w-full sm:max-w-sm" />
    </ToastPrimitive.Provider>
  );
}
