import type { ParserRead } from "@/app/utils/schema.ui";

export default function ParserDetailsCard({ parser }: { parser: ParserRead }) {
  return (
    <div className="card-fr bg-bg border border-bg-alt shadow-sm p-l font-main space-y-l max-w-3xl">
      <div className="flex items-start justify-between border-b border-bg-alt pb-m">
        <div>
          <h2 className="text-2xl font-bold text-text">{parser.name}</h2>
          <div className="flex items-center gap-m mt-s">
            <span className="font-code text-xs text-text-muted bg-bg-alt px-2 py-1 rounded-sm">
              ID: {parser.id}
            </span>
            <span className="text-xs font-bold text-fr-blue uppercase bg-fr-blue/10 px-2 py-1 rounded-sm">
              Catégorie: {parser.categorie_id || "Aucune"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Propriétaire</p>
          <span className="text-sm font-code">Admin #{parser.admin_id}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase text-text-muted tracking-widest mb-m">Propriétés additionnelles (JSON)</h3>
        {parser.extra_properties && Object.keys(parser.extra_properties).length > 0 ? (
          <pre className="bg-bg-alt/30 border border-bg-alt rounded-sm p-m text-xs font-code overflow-x-auto text-text">
            {JSON.stringify(parser.extra_properties, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-text-muted italic bg-bg-alt/10 p-m border border-bg-alt">
            Ce parser ne possède aucune configuration dynamique supplémentaire.
          </p>
        )}
      </div>
    </div>
  );
}
