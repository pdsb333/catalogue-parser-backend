"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/categories", label: "Catégories", icon: "📁" },
    { href: "/parsers", label: "Parsers", icon: "⚙️" },
    { href: "/users", label: "Utilisateurs", icon: "👤" },
  ];

  return (
    <aside className="fixed bottom-0 left-0 w-full h-16 bg-bg border-t border-bg-alt flex flex-row items-center justify-around z-50 md:w-64 md:h-screen md:top-16 md:bottom-auto md:border-t-0 md:border-r md:flex-col md:justify-start md:overflow-y-auto">
      <nav className="w-full h-full flex flex-row justify-around md:flex-col md:p-m md:space-y-s">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-m p-1 md:p-m text-[10px] md:text-sm font-bold transition-all flex-1 md:flex-none h-full md:h-auto ${
                isActive
                  ? "text-fr-blue md:bg-bg-alt/50 md:border-r-4 md:border-b-0 border-t-[3px] md:border-t-0 border-fr-blue"
                  : "text-text-muted hover:text-text md:hover:bg-bg-alt/30 border-t-[3px] md:border-t-0 border-transparent"
              }`}
            >
              <span className="text-xl md:text-lg leading-none">{link.icon}</span>
              <span className="uppercase tracking-wider block leading-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block absolute bottom-16 w-full p-m border-t border-bg-alt">
        <p className="text-[10px] text-text-muted font-code text-center uppercase">
          OAS 3.1 Documentation App
        </p>
      </div>
    </aside>
  );
}
