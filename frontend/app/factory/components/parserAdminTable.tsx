"use client";

import type { ParserRead } from "@/app/utils/schema.ui";

interface ParserAdminTableProps {
  parsers: ParserRead[];
  onEdit: (parser: ParserRead) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

/**
 * Table d'administration pour la gestion des Parsers (CRUD)
 */
export default function ParserAdminTable({ 
  parsers, 
  onEdit, 
  onDelete, 
  isLoading 
}: ParserAdminTableProps) {
  
  if (isLoading) {
    return <div className="p-l text-center animate-pulse text-text-muted">Chargement des parsers...</div>;
  }

  return (
    <div className="w-full overflow-x-auto border border-bg-alt bg-bg shadow-sm">
      <table className="w-full text-left border-collapse font-main">
        <thead>
          <tr className="bg-bg-alt/30 border-b border-bg-alt text-text-muted text-[11px] uppercase tracking-wider">
            <th className="p-m font-bold">Nom du Parser</th>
            <th className="p-m font-bold">ID Catégorie</th>
            <th className="p-m font-bold">Extra Props</th>
            <th className="p-m font-bold">Admin ID</th>
            <th className="p-m font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-alt">
          {parsers.length > 0 ? (
            parsers.map((parser) => (
              <tr key={parser.id} className="hover:bg-bg-alt/10 transition-colors group">
                {/* Nom + ID technique */}
                <td className="p-m">
                  <div className="flex flex-col">
                    <span className="font-bold text-text text-sm">{parser.name}</span>
                    <span className="text-[10px] font-code text-text-muted">UUID: {parser.id}</span>
                  </div>
                </td>

                {/* Categorie ID avec style conditionnel */}
                <td className="p-m">
                  <span className={`px-s py-0.5 text-xs font-code rounded-sm ${
                    parser.categorie_id 
                      ? "bg-fr-blue/10 text-fr-blue" 
                      : "bg-bg-alt text-text-muted italic"
                  }`}>
                    {parser.categorie_id ? `#${parser.categorie_id}` : "non classé"}
                  </span>
                </td>

                {/* Extra Properties (Compteur de clés) */}
                <td className="p-m">
                  <div className="flex items-center gap-xs">
                    <div className={`h-1.5 w-1.5 rounded-full ${parser.extra_properties ? 'bg-success' : 'bg-bg-alt'}`} />
                    <span className="text-xs text-text">
                      {parser.extra_properties ? Object.keys(parser.extra_properties).length : 0} param(s)
                    </span>
                  </div>
                </td>

                {/* Admin Owner */}
                <td className="p-m">
                  <span className="text-xs font-code text-text-muted">@{parser.admin_id}</span>
                </td>

                {/* Actions groupées */}
                <td className="p-m text-right">
                  <div className="flex justify-end gap-m">
                    <button
                      onClick={() => onEdit(parser)}
                      className="text-xs font-bold text-fr-blue hover:underline cursor-pointer transition-all"
                    >
                      ÉDITER
                    </button>
                    <button
                      onClick={() => onDelete(parser.id)}
                      className="text-xs font-bold text-error hover:text-error/70 cursor-pointer transition-all"
                    >
                      SUPPRIMER
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-xl text-center text-text-muted italic">
                Aucun parser configuré pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}