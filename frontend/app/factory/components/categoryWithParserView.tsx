"use client";

import { useState } from "react";
import type { CategorieWithParsers } from "@/app/utils/schema.ui";

interface CategoryWithParsersViewProps {
  category: CategorieWithParsers;
}

/**
 * Vue hiérarchique Catégorie > Liste de Parsers (OAS: CategorieWithParsers)
 */
export default function CategoryWithParsersView({ category }: CategoryWithParsersViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-fr border border-bg-alt bg-bg mb-m overflow-hidden">
      {/* Header de la Catégorie (Déclencheur) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-m hover:bg-bg-alt/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-m">
          <div className="bg-fr-blue/10 p-s rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-m w-m text-fr-blue">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-main font-bold text-text">{category.name}</h3>
            <p className="text-xs text-text-muted font-code italic">
              {category.parsers.length} parser(s) configuré(s)
            </p>
          </div>
        </div>

        {/* Indicateur d'ouverture */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`h-m w-m text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Liste des Parsers (Contenu extensible) */}
      {isOpen && (
        <div className="bg-bg-alt/20 border-t border-bg-alt p-m space-y-s animate-in slide-in-from-top-1 duration-200">
          {category.parsers.length > 0 ? (
            category.parsers.map((parser) => (
              <div 
                key={parser.id} 
                className="flex items-center justify-between bg-bg p-s border border-bg-alt rounded-sm group hover:border-fr-blue/30 transition-all"
              >
                <div className="flex items-center gap-s">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="font-main text-sm font-medium text-text">{parser.name}</span>
                  <span className="font-code text-[10px] text-text-muted bg-bg-alt px-1">ID: {parser.id}</span>
                </div>
                
                <div className="flex gap-m opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] font-bold text-fr-blue uppercase hover:underline cursor-pointer">
                    Éditer
                  </button>
                  <button className="text-[10px] font-bold text-text-muted uppercase hover:text-text cursor-pointer">
                    Logs
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted italic py-s px-m">
              Aucun parser n'est rattaché à cette catégorie.
            </p>
          )}
        </div>
      )}
    </div>
  );
}