export default function EmptyState({ message, actionText, onAction }: { message: string, actionText?: string, onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-xl border-2 border-dashed border-bg-alt bg-bg-alt/10 rounded text-center">
      <div className="bg-bg-alt p-m rounded-full text-text-muted mb-m">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-l w-l"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="15" y1="9" y2="9"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
      </div>
      <h3 className="font-main font-bold text-text mb-s">Aucune donnée</h3>
      <p className="text-sm text-text-muted max-w-sm mb-m">{message}</p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="btn-secondary px-m py-s shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
