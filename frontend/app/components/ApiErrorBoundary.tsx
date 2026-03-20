"use client";

import { useState } from "react";
import type { HTTPValidationError } from "@/app/utils/schema.ui";

interface ApiErrorBoundaryProps {
  error: HTTPValidationError | null;
  onDismiss: () => void;
}

export default function ApiErrorBoundary({ error, onDismiss }: ApiErrorBoundaryProps) {
  if (!error) return null;

  return (
    <div className="bg-error/10 border-l-4 border-error p-m mb-m animate-in fade-in slide-in-from-top-2 relative">
      <button 
        onClick={onDismiss} 
        className="absolute top-m right-m text-error cursor-pointer"
        aria-label="Fermer l'alerte"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <div className="flex items-center gap-s text-error mb-s">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="font-main font-bold">Erreur de validation (HTTP 422)</h3>
      </div>
      
      {error.detail && error.detail.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-error/90 font-code space-y-1 ml-s">
          {error.detail.map((err, idx) => (
            <li key={idx}>
              <span className="font-bold">{err.loc.join(" > ")}</span> : {err.msg}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-error/90 font-code">Une erreur inattendue est survenue.</p>
      )}
    </div>
  );
}
