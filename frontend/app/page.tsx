"use client";

import Link from "next/link";

// Data pour la grille de fonctionnalités (doit être définie avant son utilisation)
const features = [
  {
    title: "Hiérarchie de Catégories",
    description: "Structurez vos données avec un système d'arborescence avancé. Reliez n'importe quel parser à une catégorie spécifique en un clic.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    )
  },
  {
    title: "Propriétés Dynamiques JSON",
    description: "Éditeur clé-valeur puissant pour gérer les propriétés additionnelles dynamiques de chaque parser selon vos besoins de scraping.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    )
  },
  {
    title: "Sécurité & IAM",
    description: "Protection complète des routes via OAuth2 (Password flow). Interface d'administration sécurisée accessible aux utilisateurs authentifiés.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
    )
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text font-main flex flex-col selection:bg-fr-blue selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-l py-m border-b border-bg-alt/50 bg-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-m group cursor-pointer">
          <div className="h-10 w-10 bg-fr-blue text-bg flex items-center justify-center font-bold text-2xl rounded shadow-sm group-hover:scale-105 transition-transform duration-300">
            C
          </div>
          <span className="font-bold text-xl tracking-tight">Catalogue Parser API</span>
        </div>
        <Link 
          href="/login"
          className="text-sm font-bold px-m py-s rounded-sm border-2 border-fr-blue text-fr-blue hover:bg-fr-blue hover:text-bg transition-colors duration-300 shadow-sm"
        >
          Accès Administrateur
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-xl text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fr-blue/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fr-blue/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-4xl space-y-l animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-block py-1 px-3 rounded-full bg-fr-blue/10 text-fr-blue text-xs font-bold tracking-widest uppercase mb-m border border-fr-blue/20">
            OAS 3.1 &bull; Next.js 15
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-text">
            Le système de gestion de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fr-blue to-blue-400">
              parsers web dynamique.
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            Centralisez, configurez et gérez vos extracteurs de données. 
            Une architecture puissante pensée pour l'automatisation de vos flux de catalogues.
          </p>
          
          <div className="pt-m flex flex-col sm:flex-row items-center justify-center gap-m">
            <Link 
              href="/login" 
              className="bg-fr-blue text-bg px-xl py-m font-bold text-lg hover:shadow-lg hover:bg-fr-blue/90 transition-all duration-300 flex items-center justify-center gap-s rounded-sm w-full sm:w-auto"
            >
              Accéder au Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link 
              href="/categories" 
              className="px-xl py-m font-bold text-lg text-text border-2 border-bg-alt hover:border-text transition-all duration-300 flex items-center justify-center rounded-sm w-full sm:w-auto"
            >
              Voir les Catégories
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-l text-left max-w-6xl relative z-10 w-full">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-xl bg-bg border border-bg-alt hover:border-fr-blue/50 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 group"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="h-12 w-12 bg-bg-alt/50 group-hover:bg-fr-blue/10 group-hover:text-fr-blue rounded flex items-center justify-center mb-l transition-colors duration-300 text-text">
                 {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-s">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-bg-alt py-l text-center text-text-muted text-sm font-code">
        <p>&copy; {new Date().getFullYear()} Catalogue Parser API. Construit avec React 19 & Next.js.</p>
      </footer>
    </div>
  );
}
