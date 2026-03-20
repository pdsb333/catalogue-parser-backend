"use client";

import { useState, useEffect } from "react";
import type { ParserRead, CategorieRead, ParserCreate } from "@/app/utils/schema.ui";
import ValidationBadge from "../../components/ValidationBadge";

interface ParserUpsertFormProps {
  initialData?: ParserRead | null;
  categories: CategorieRead[];
  onSubmit: (data: ParserCreate) => void;
  onCancel: () => void;
}

export default function ParserUpsertForm({
  initialData,
  categories,
  onSubmit,
  onCancel
}: ParserUpsertFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    categorie_id: "" as string | number,
  });

  // Gestion dynamique des extra_properties en format Clé-Valeur
  const [extraProps, setExtraProps] = useState<{ key: string; value: string }[]>([]);
  const [errorName, setErrorName] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        categorie_id: initialData.categorie_id ?? "",
      });
      if (initialData.extra_properties) {
        const propsArray = Object.entries(initialData.extra_properties).map(([k, v]) => ({
          key: k,
          value: typeof v === "string" ? v : JSON.stringify(v)
        }));
        setExtraProps(propsArray.length > 0 ? propsArray : [{ key: "", value: "" }]);
      } else {
        setExtraProps([{ key: "", value: "" }]);
      }
    } else {
      setExtraProps([{ key: "", value: "" }]);
    }
  }, [initialData]);

  const addPropertyRow = () => {
    setExtraProps([...extraProps, { key: "", value: "" }]);
  };

  const removePropertyRow = (index: number) => {
    const updated = [...extraProps];
    updated.splice(index, 1);
    setExtraProps(updated.length > 0 ? updated : [{ key: "", value: "" }]);
  };

  const updateProperty = (index: number, field: "key" | "value", val: string) => {
    const updated = [...extraProps];
    updated[index][field] = val;
    setExtraProps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorName(null);

    if (!formData.name.trim()) {
      setErrorName("Le nom du parser est requis.");
      return;
    }

    // Convert string K-V to object
    const extra_properties: Record<string, any> = {};
    extraProps.forEach(prop => {
      const trimmedKey = prop.key.trim();
      if (trimmedKey) {
        try {
          // Attempt to parse value as JSON (e.g. true, false, numbers, nested objects)
          extra_properties[trimmedKey] = JSON.parse(prop.value);
        } catch {
          // Fallback to plain string if it's not JSON
          extra_properties[trimmedKey] = prop.value;
        }
      }
    });

    onSubmit({
      name: formData.name,
      categorie_id: formData.categorie_id === "" ? null : Number(formData.categorie_id),
      extra_properties: Object.keys(extra_properties).length > 0 ? extra_properties : undefined
    });
  };

  return (
    <div className="bg-bg border border-bg-alt p-l shadow-lg font-main max-w-3xl">
      <div className="flex justify-between items-center mb-l border-b border-bg-alt pb-m">
        <h2 className="text-xl font-bold text-text">
          {initialData ? `Édition: Parser #${initialData.id}` : "Nouveau Parser"}
        </h2>
        <span className="text-[10px] font-code bg-bg-alt px-2 py-1 text-text-muted">
          /parsers
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-l">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-m">
          {/* Nom */}
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-bold uppercase text-text-muted">Nom du Parser</label>
            <input
              type="text"
              className={`border p-m focus:outline-none transition-all ${errorName ? "border-error bg-error/5" : "border-bg-alt focus:border-fr-blue bg-bg"}`}
              placeholder="ex: GitHub Scraper"
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrorName(null); }}
            />
            {errorName && <ValidationBadge error={errorName} />}
          </div>

          {/* Catégorie */}
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-bold uppercase text-text-muted">Catégorie Parente</label>
            <select
              className="border border-bg-alt p-m bg-bg focus:border-fr-blue outline-none cursor-pointer"
              value={formData.categorie_id}
              onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
            >
              <option value="">-- Aucune --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Extra Properties Editor */}
        <div className="border border-bg-alt p-m bg-bg-alt/5 rounded-sm">
          <div className="flex justify-between items-center mb-m">
            <div>
              <h3 className="text-sm font-bold text-text uppercase tracking-widest">Configuration Avancée</h3>
              <p className="text-xs text-text-muted mt-1 italic">Propriétés additionnelles dynamiques (extra_properties)</p>
            </div>
            <button
              type="button"
              onClick={addPropertyRow}
              className="text-xs font-bold bg-bg-alt hover:bg-fr-blue hover:text-bg text-text px-s py-1 transition-colors cursor-pointer"
            >
              + Ajouter une propriété
            </button>
          </div>

          <div className="space-y-s">
            {extraProps.map((prop, index) => (
              <div key={index} className="flex gap-s items-start">
                <input
                  type="text"
                  placeholder="Clé (ex: timeout)"
                  className="font-code flex-1 border border-bg-alt p-s text-sm bg-bg focus:border-fr-blue outline-none"
                  value={prop.key}
                  onChange={(e) => updateProperty(index, "key", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Valeur (ex: 5000, true, 'string')"
                  className="font-code flex-1 border border-bg-alt p-s text-sm bg-bg focus:border-fr-blue outline-none"
                  value={prop.value}
                  onChange={(e) => updateProperty(index, "value", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removePropertyRow(index)}
                  className="p-s bg-bg border border-bg-alt hover:bg-error/10 hover:text-error hover:border-error text-text-muted transition-colors cursor-pointer"
                  title="Supprimer cette propriété"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-m pt-m border-t border-bg-alt">
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
            {initialData ? "Sauvegarder" : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}
