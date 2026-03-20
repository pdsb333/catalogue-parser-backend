"use client";

import type { CategorieRead } from "@/app/utils/schema.ui";

interface CategorySelectProps {
  categories: CategorieRead[];
  value: number | string | null;
  onChange: (id: number | null) => void;
  label?: string;
  error?: string;
}

/**
 * Sélecteur de catégorie typé pour les formulaires de Parsers
 */
export default function CategorySelect({
  categories,
  value,
  onChange,
  label = "Catégorie parente",
  error
}: CategorySelectProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    // Si l'utilisateur choisit l'option vide, on renvoie null pour l'API
    onChange(val === "" ? null : Number(val));
  };

  return (
    <div className="flex flex-col gap-xs w-full font-main">
      {label && (
        <label className="text-xs font-bold uppercase text-text-muted tracking-tight">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={handleChange}
          className={`w-full appearance-none border p-m bg-bg pr-xl outline-none transition-all cursor-pointer ${
            error ? "border-error focus:border-error" : "border-bg-alt focus:border-fr-blue"
          }`}
        >
          <option value="">-- Aucune (Parser global) --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} (ID: {cat.id})
            </option>
          ))}
        </select>
        
        {/* Petit indicateur visuel (flèche personnalisée) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-m text-text-muted">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && <p className="text-[10px] text-error font-bold italic">{error}</p>}
    </div>
  );
}