"use client";

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  categoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialogue de confirmation de suppression (DSFR Style / Tailwind v4)
 */
export default function CategoryDeleteDialog({
  isOpen,
  categoryName,
  onConfirm,
  onCancel,
}: CategoryDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 backdrop-blur-sm p-m">
      <div 
        className="card-fr w-full max-w-md border-t-4 border-t-error bg-bg p-l shadow-card animate-in fade-in zoom-in duration-200"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Header avec icône d'alerte native */}
        <div className="flex items-center gap-m text-error mb-m">
          <div className="rounded-full bg-error/10 p-s">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-l w-l">
              <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-main text-xl font-bold text-text">Confirmer la suppression</h2>
        </div>

        {/* Corps du message */}
        <div className="space-y-m mb-l">
          <p className="text-text-muted font-main">
            Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-bold text-text">"{categoryName}"</span> ?
          </p>
          <div className="bg-bg-alt p-m border-l-4 border-error text-sm text-text">
            <p className="font-bold mb-1">Attention :</p>
            <p>Cette action est irréversible et pourrait impacter les parsers associés.</p>
          </div>
        </div>

        {/* Actions (DSFR: l'action principale est souvent à droite) */}
        <div className="flex flex-col sm:flex-row justify-end gap-m">
          <button
            onClick={onCancel}
            className="order-2 sm:order-1 px-m py-s font-bold text-text hover:bg-bg-alt border border-bg-alt transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="order-1 sm:order-2 px-m py-s font-bold bg-error text-bg hover:bg-fr-red/90 transition-opacity cursor-pointer shadow-sm"
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
}