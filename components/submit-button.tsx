"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/**
 * Submit button that shows a spinner and disables itself while its form's
 * server action is running, so slow network round trips feel responsive.
 */
export function SubmitButton({
  children,
  pendingText,
  className,
  formAction,
  formNoValidate,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formAction?: any;
  formNoValidate?: boolean;
}) {
  const { pending, action } = useFormStatus();
  const isActive = pending && (formAction === undefined || action === formAction);

  return (
    <button
      formAction={formAction}
      formNoValidate={formNoValidate}
      disabled={pending}
      className={`${className ?? ""} inline-flex items-center justify-center gap-2 disabled:opacity-60`}
    >
      {isActive && <Loader2 className="h-4 w-4 animate-spin" />}
      {isActive && pendingText ? pendingText : children}
    </button>
  );
}
