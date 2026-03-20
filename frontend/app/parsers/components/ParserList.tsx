"use client";

import type { ParserRead } from "@/app/utils/schema.ui";

interface ParserListProps {
  parsers: ParserRead[];
  totalCount?: number;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
  onEdit?: (parser: ParserRead) => void;
}

/**
 * Liste des parsers d'une catégorie (OAS: Read Parsers By Categorie)
 */
export default function ParserList({
  parsers,
  totalCount,
  limit,
  offset,
  onPageChange,
  onEdit
}: ParserListProps) {
  
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-m font-main">
      {/* Liste des items */}
      <div className="grid gap-s">
        {parsers.length > 0 ? (
          parsers.map((parser) => (
            <div 
              key={parser.id} 
              className="flex items-center justify-between border border-bg-alt bg-bg p-m hover:shadow-sm transition-shadow group"
            >
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-s">
                  <span className="font-bold text-text">{parser.name}</span>
                  <span className="font-code text-[10px] bg-bg-alt px-1 text-text-muted">
                    ID: {parser.id}
                  </span>
                </div>
                
                {/* Affichage des extra_properties (si présentes) */}
                {parser.extra_properties && Object.keys(parser.extra_properties).length > 0 && (
                  <div className="flex flex-wrap gap-xs mt-xs">
                    {Object.entries(parser.extra_properties).map(([key, value]) => (
                      <span 
                        key={key} 
                        className="text-[10px] px-1.5 py-0.5 bg-fr-blue/5 text-fr-blue border border-fr-blue/10 rounded-sm"
                      >
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {onEdit && (
                <button
                  onClick={() => onEdit(parser)}
                  className="btn-secondary text-xs py-1 px-s opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Configurer
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="py-xl text-center border-2 border-dashed border-bg-alt text-text-muted">
            Aucun parser trouvé pour cette catégorie.
          </div>
        )}
      </div>

      {/* Pagination (Navigation entre limit/offset) */}
      <div className="flex items-center justify-between pt-m border-t border-bg-alt">
        <p className="text-xs text-text-muted">
          Page <span className="font-bold text-text">{currentPage}</span>
        </p>
        
        <div className="flex gap-s">
          <button
            disabled={offset === 0}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            className="px-m py-1 border border-bg-alt text-xs font-bold hover:bg-bg-alt disabled:opacity-30 cursor-pointer transition-colors"
          >
            Précédent
          </button>
          <button
            disabled={parsers.length < limit}
            onClick={() => onPageChange(offset + limit)}
            className="px-m py-1 border border-bg-alt text-xs font-bold hover:bg-bg-alt disabled:opacity-30 cursor-pointer transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}