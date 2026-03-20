interface PaginationControlProps {
  limit: number;
  offset: number;
  totalCount?: number;
  onPageChange: (newOffset: number) => void;
}

export default function PaginationControl({ limit, offset, totalCount, onPageChange }: PaginationControlProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const isFirstPage = offset === 0;
  // S'il n'y a pas de totalCount, on ne peut pas vraiment disabled "Suivant", 
  // mais la logique parente le désactivera si on récupère moins d'items que 'limit'.
  const isLastPage = totalCount !== undefined && offset + limit >= totalCount;

  return (
    <div className="flex items-center justify-between pt-m border-t border-bg-alt font-main">
      <p className="text-xs text-text-muted">
        Page <span className="font-bold text-text">{currentPage}</span>
        {totalCount !== undefined && ` sur ${Math.ceil(totalCount / limit)}`}
      </p>
      
      <div className="flex gap-s">
        <button
          disabled={isFirstPage}
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          className="px-m py-1 border border-bg-alt text-xs font-bold text-text hover:bg-bg-alt disabled:opacity-30 cursor-pointer transition-colors shadow-sm"
        >
          Précédent
        </button>
        <button
          disabled={isLastPage}
          onClick={() => onPageChange(offset + limit)}
          className="px-m py-1 border border-bg-alt text-xs font-bold text-text hover:bg-bg-alt disabled:opacity-30 cursor-pointer transition-colors shadow-sm"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
