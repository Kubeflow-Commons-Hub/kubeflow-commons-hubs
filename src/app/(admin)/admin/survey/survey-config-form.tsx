"use client";

import { useState, useTransition } from "react";
import { updateSurveyConfig } from "@/lib/admin/survey";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurveyConfigFormProps {
  initialValues?: {
    isEnabled: boolean;
    customLinkUrl: string;
    customLinkLabel: string;
    showQrCode: boolean;
  };
}

export function SurveyConfigForm({ initialValues }: SurveyConfigFormProps) {
  const [isEnabled, setIsEnabled] = useState(initialValues?.isEnabled ?? false);
  const [customLinkUrl, setCustomLinkUrl] = useState(
    initialValues?.customLinkUrl ?? ""
  );
  const [customLinkLabel, setCustomLinkLabel] = useState(
    initialValues?.customLinkLabel ?? ""
  );
  const [showQrCode, setShowQrCode] = useState(
    initialValues?.showQrCode ?? true
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateSurveyConfig({
        isEnabled,
        customLinkUrl: customLinkUrl || undefined,
        customLinkLabel: customLinkLabel || undefined,
        showQrCode,
      });

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Survey configuration updated." });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Survey toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-bg-primary p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Enable Survey
          </p>
          <p className="text-xs text-text-muted">
            Shows the Survey button in the website navbar
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          onClick={() => setIsEnabled(!isEnabled)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
            isEnabled ? "bg-[var(--kf-blue)]" : "bg-text-muted/30"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
              isEnabled ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Custom link URL */}
      <div>
        <label htmlFor="survey-link-url" className="mb-1.5 block text-sm font-medium text-text-primary">
          Custom Link URL
        </label>
        <p className="mb-2 text-xs text-text-muted">
          Shown after survey submission. Can be a signup page, community link,
          etc.
        </p>
        <input
          id="survey-link-url"
          type="url"
          value={customLinkUrl}
          onChange={(e) => setCustomLinkUrl(e.target.value)}
          placeholder="https://lu.ma/your-event"
          className="form-input w-full"
        />
      </div>

      {/* Custom link label */}
      <div>
        <label htmlFor="survey-link-label" className="mb-1.5 block text-sm font-medium text-text-primary">
          Custom Link Label
        </label>
        <input
          id="survey-link-label"
          type="text"
          value={customLinkLabel}
          onChange={(e) => setCustomLinkLabel(e.target.value)}
          placeholder="Join our community"
          className="form-input w-full"
        />
      </div>

      {/* QR Code toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-bg-primary p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Show QR Code
          </p>
          <p className="text-xs text-text-muted">
            Display a QR code for the custom link after survey submission
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showQrCode}
          onClick={() => setShowQrCode(!showQrCode)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
            showQrCode ? "bg-[var(--kf-blue)]" : "bg-text-muted/30"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
              showQrCode ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm",
            message.type === "success"
              ? "border border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
              : "border border-red-500/20 bg-red-500/5 text-red-500"
          )}
        >
          {message.text}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--kf-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--kf-blue)]/90 disabled:opacity-50"
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Save Configuration
      </button>
    </form>
  );
}
