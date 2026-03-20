"use client";

import { useState } from "react";
import type { CategorieCreate } from "@/app/utils/schema.ui";

interface CategoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategorieCreate) => void;
}

export default function CategoryCreateModal({ isOpen, onClose, onSubmit }: CategoryCreateModalProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 backdrop-blur-sm p-m">
      <div 
        className="card-fr w-full max-w-md border-t-4 border-t-fr-blue bg-bg p-l shadow-card animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-m text-fr-blue">
          <h2 className="font-main text-xl font-bold text-text">Nouvelle Catégorie</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-m mb-l">
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-bold uppercase text-text-muted tracking-tight">Nom de la catégorie</label>
            <input
              type="text"
              required
              className="border border-bg-alt p-m focus:border-fr-blue outline-none bg-bg transition-all font-main"
              placeholder="ex: Scraping E-commerce"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-m pt-m">
            <button
              type="button"
              onClick={onClose}
              className="px-m py-s font-bold text-text hover:bg-bg-alt transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary px-m py-s shadow-sm cursor-pointer"
            >
              Créer la catégorie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
