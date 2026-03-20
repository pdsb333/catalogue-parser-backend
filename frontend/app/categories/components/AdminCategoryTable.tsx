"use client";

import type { CategorieRead } from "@/app/utils/schema.ui";

interface AdminCategoryTableProps {
  categories: CategorieRead[];
  onEdit: (cat: CategorieRead) => void;
  onDelete: (id: number) => void;
}

/**
 * Tableau d'administration des catégories (DSFR Style / Tailwind v4)
 */
export default function AdminCategoryTable({ 
  categories, 
  onEdit, 
  onDelete 
}: AdminCategoryTableProps) {
  return (
    <div className="card-fr overflow-hidden border border-bg-alt bg-bg shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-bg-alt bg-bg-alt/50 text-text-muted">
              <th className="p-m font-main text-sm font-bold uppercase tracking-wider">ID</th>
              <th className="p-m font-main text-sm font-bold uppercase tracking-wider">Nom de la Catégorie</th>
              <th className="p-m font-main text-sm font-bold uppercase tracking-wider">Admin propriétaire</th>
              <th className="p-m font-main text-sm font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-alt">
            {categories.map((cat) => (
              <tr key={cat.id} className="group hover:bg-bg-alt/30 transition-colors">
                {/* ID en JetBrains Mono */}
                <td className="p-m font-code text-sm text-fr-blue font-medium">
                  #{cat.id}
                </td>
                
                {/* Nom en Jost Bold */}
                <td className="p-m font-main font-bold text-text">
                  {cat.name}
                </td>
                
                {/* Admin ID */}
                <td className="p-m font-main text-sm text-text-muted">
                  <span className="flex items-center gap-s">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-m w-m opacity-50"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    ID: {cat.admin_id}
                  </span>
                </td>

                {/* Actions groupées */}
                <td className="p-m text-right">
                  <div className="flex justify-end gap-m">
                    <button
                      onClick={() => onEdit(cat)}
                      className="text-sm font-bold text-fr-blue hover:underline cursor-pointer"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => onDelete(cat.id)}
                      className="text-sm font-bold text-error hover:text-fr-red/80 transition-colors cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer du tableau pour la pagination (OAS: limit/offset) */}
      <div className="bg-bg-alt/20 p-m border-t border-bg-alt flex justify-between items-center">
        <span className="text-xs text-text-muted font-main">
          Affichage de {categories.length} catégories
        </span>
        <div className="flex gap-s">
           <button className="px-s py-1 border border-bg-alt text-xs font-bold disabled:opacity-30 cursor-pointer">Précédent</button>
           <button className="px-s py-1 border border-bg-alt text-xs font-bold cursor-pointer">Suivant</button>
        </div>
      </div>
    </div>
  );
}