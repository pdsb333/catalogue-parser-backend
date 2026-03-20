import type { CategorieRead } from "@/app/utils/schema.ui";

interface CategoryCardProps {
  category: CategorieRead;
  onEdit?: (id: number) => void;
}

/**
 * Composant CategoryCard
 */
export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
  return (
    <div className="card-fr group flex flex-col justify-between border border-bg-alt bg-bg p-m shadow-card transition-all hover:border-fr-blue/30">
      
      {/* Header : Icône et Titre */}
      <div className="space-y-m">
        <div className="flex items-start justify-between">
          {/* Icône Database en SVG */}
          <div className="rounded-sm bg-bg-alt p-s text-fr-blue group-hover:bg-fr-blue group-hover:text-bg transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-l w-l"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5V19A9 3 0 0 0 21 19V5" />
              <path d="M3 12A9 3 0 0 0 21 12" />
            </svg>
          </div>
          <span className="font-code text-xs text-text-muted bg-bg-alt px-2 py-1 rounded-radius">
            # {category.id}
          </span>
        </div>

        <div>
          <h3 className="font-main text-lg font-bold text-text line-clamp-1">
            {category.name}
          </h3>
          <div className="mt-s flex items-center gap-s text-sm text-text-muted">
            {/* Icône User en SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-m w-m"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Admin ID: {category.admin_id}</span>
          </div>
        </div>
      </div>

      {/* Footer : Actions */}
      <div className="mt-l flex items-center justify-between border-t border-bg-alt pt-m">
        <button 
          onClick={() => onEdit?.(category.id)}
          className="text-sm font-bold text-fr-blue hover:underline underline-offset-4 cursor-pointer"
        >
          Modifier
        </button>
        
        <button className="flex items-center gap-s text-sm font-medium text-text-muted hover:text-text transition-colors cursor-pointer">
          Voir les parsers
          {/* Icône ArrowRight en SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-m w-m"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}