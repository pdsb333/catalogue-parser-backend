import type { ValidationError } from "@/app/utils/schema.ui";

interface ValidationBadgeProps {
  error?: ValidationError | string | null;
}

export default function ValidationBadge({ error }: ValidationBadgeProps) {
  if (!error) return null;

  const msg = typeof error === "string" ? error : error.msg;

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-error/10 text-[10px] font-bold text-error border border-error/20 animate-in fade-in zoom-in duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {msg}
    </span>
  );
}
