"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, SendHorizonal, X } from "lucide-react";
import React from "react";

const easing = [0.22, 1, 0.36, 1] as const;

type RequestAccountUpdateModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (note: string) => void;
};

export function RequestAccountUpdateModal({
  open,
  onClose,
  onSubmit,
}: RequestAccountUpdateModalProps) {
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setNote("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit?.(note.trim());
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-account-update-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: easing }}
        >
          <motion.button
            type="button"
            aria-label="Close request account update modal"
            className="absolute inset-0 border-0 bg-[radial-gradient(circle_at_top,_rgba(52,47,113,0.72),_rgba(17,24,39,0.76))] backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          <motion.div
            className="relative z-[1] max-h-[68dvh] w-full max-w-[520px] overflow-hidden rounded-[20px] border border-[#dbdce4] bg-white shadow-[0_30px_60px_-28px_rgba(15,23,42,0.52)]"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: easing }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#ebedf2] px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex size-11 items-center justify-center rounded-xl bg-[#f2f3f7] text-[#272467]">
                  <Info className="size-5" strokeWidth={2.2} />
                </div>
                <div>
                  <h2
                    id="request-account-update-title"
                    className="m-0 text-[1.5rem] leading-none font-bold tracking-tight text-[#1f2250]"
                  >
                    Request Account Update
                  </h2>
                  <p className="m-0 mt-1.5 text-[10px] font-bold tracking-[0.24em] text-[#6c7089] uppercase">
                    Manual Review Required
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 items-center justify-center rounded-xl border-0 bg-transparent text-[#9ea2b4] transition-colors hover:bg-[#f5f6fb] hover:text-[#4a4f69]"
                aria-label="Close"
              >
                <X className="size-6" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <div className="rounded-2xl bg-[#272467] px-6 py-5 text-white">
                <h3 className="m-0 text-[1.15rem] leading-tight font-bold tracking-tight">
                  Support Team Interaction Required
                </h3>
                <p className="m-0 mt-2.5 max-w-[560px] text-sm leading-relaxed text-[#d7d9f0]">
                  To ensure the security of your funds, settlement account updates must be processed
                  by our compliance team. Once you raise this request, a support specialist will
                  reach out to you within 24 hours to verify the new details.
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label
                    htmlFor="request-note"
                    className="text-[11px] font-bold tracking-[0.16em] text-[#6f7488] uppercase"
                  >
                    Internal Note / Request Reason
                  </label>
                  <span className="text-[10px] font-medium tracking-[0.18em] text-[#adb2c1] uppercase">
                    Optional
                  </span>
                </div>
                <textarea
                  id="request-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Please provide details about the update or any specific reason for this change..."
                  className="h-44 w-full resize-none rounded-2xl border border-[#dfe2ea] bg-[#f9fafc] px-5 py-4 text-sm leading-relaxed text-[#2c3150] placeholder:text-[#a3a8ba] focus:border-[#2d2b78] focus:ring-2 focus:ring-[#2d2b78]/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-[#ebedf2] bg-[#fafbff] px-5 py-4 sm:grid-cols-2 sm:px-7 sm:py-5">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-xl border border-transparent bg-transparent text-sm font-semibold text-[#647084] transition-colors hover:bg-[#eef1f7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-0 bg-[#262267] text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(38,34,103,0.7)] transition-all hover:brightness-110"
              >
                <SendHorizonal className="size-5" strokeWidth={2.5} />
                Raise Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
