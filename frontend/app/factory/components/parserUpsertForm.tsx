"use client";

import { useState, useEffect } from "react";
import type { ParserRead, CategorieRead, ParserCreate } from "@/app/utils/schema.ui";

interface ParserUpsertFormProps {
  initialData?: ParserRead | null; // Si présent = Mode Édition
  categories: CategorieRead[];     // Liste pour le menu déroulant
  onSubmit: (data: ParserCreate) => void;
  onCancel: () => void;
}

/**
 * Formulaire de Création / Édition de Parser (OAS: ParserCreate)
 */
export default function ParserUpsertForm({
  initialData,
  categories,
  onSubmit,
  onCancel
}: ParserUpsertFormProps) {
  
  // État local synchronisé avec l'interface ParserCreate
  const [formData, setFormData] = useState({
    name: "",
    categorie_id: "" as string | number,
    extra_string: "{}" // Version texte pour le textarea
  });

  const [jsonError, setJsonError] = useState<string | null>(null);

  // Pré-remplissage en mode édition
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        categorie_id: initialData.categorie_id ?? "",
        extra_string: JSON.stringify(initialData.extra_properties || {}, null, 2)
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Valider le JSON
      const parsedExtra = JSON.parse(formData.extra_string);
      setJsonError(null);
      
      // 2. Envoyer les données formatées
      onSubmit({
        name: formData.name,
        categorie_id: formData.categorie_id === "" ? null : Number(formData.categorie_id),
        extra_properties: parsedExtra
      });
    } catch (err) {
      setJsonError("Format JSON invalide (vérifiez les guillemets et les virgules)");
    }
  };

  return (
    <div className="bg-bg border border-bg-alt p-l shadow-lg font-main max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-l border-b border-bg-alt pb-m">
        <h2 className="text-xl font-bold text-text">
          {initialData ? `Modifier le Parser #${initialData.id}` : "Créer un nouveau Parser"}
        </h2>
        <span className="text-[10px] font-code bg-bg-alt px-2 py-1 text-text-muted">
          API: /parsers
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-m">
        {/* Champ Nom */}
        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold uppercase text-text-muted tracking-tight">Nom du Parser</label>
          <input
            type="text"
            required
            placeholder="ex: Amazon Product Scraper"
            className="border border-bg-alt p-m focus:border-fr-blue outline-none bg-bg transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Sélection Catégorie */}
        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold uppercase text-text-muted tracking-tight">Catégorie Parente</label>
          <select
            className="border border-bg-alt p-m bg-bg focus:border-fr-blue outline-none cursor-pointer"
            value={formData.categorie_id}
            onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
          >
            <option value="">-- Aucune catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Configuration JSON (extra_properties) */}
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold uppercase text-text-muted tracking-tight">Configuration (JSON)</label>
            {jsonError && <span className="text-[10px] text-error font-bold italic">{jsonError}</span>}
          </div>
          <textarea
            rows={8}
            className={`font-code text-sm border p-m bg-bg-alt/10 outline-none transition-all ${
              jsonError ? "border-error focus:border-error" : "border-bg-alt focus:border-fr-blue"
            }`}
            value={formData.extra_string}
            onChange={(e) => {
              setFormData({ ...formData, extra_string: e.target.value });
              setJsonError(null); // Reset l'erreur pendant la frappe
            }}
          />
          <p className="text-[10px] text-text-muted italic">
            Astuce : Utilisez des doubles guillemets. Ex: {"{ \"key\": \"value\" }"}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-m pt-l">
          <button
            type="button"
            onClick={onCancel}
            className="px-l py-s text-sm font-bold text-text hover:bg-bg-alt transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary px-xl py-s shadow-md cursor-pointer"
          >
            {initialData ? "Enregistrer les modifications" : "Créer le parser"}
          </button>
        </div>
      </form>
    </div>
  );
}