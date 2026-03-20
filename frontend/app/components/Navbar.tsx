"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-bg border-b border-bg-alt flex items-center justify-between px-m md:px-l shadow-sm fixed top-0 w-full z-40">
      <div className="flex items-center gap-s sm:gap-m overflow-hidden">
        <div className="h-8 w-8 min-w-[32px] bg-fr-blue text-bg flex items-center justify-center font-bold text-xl rounded">
          C
        </div>
        <span className="font-main font-bold text-sm sm:text-lg tracking-tight truncate">
          Catalogue Parser API
        </span>
      </div>

      <div className="flex items-center gap-s sm:gap-m flex-shrink-0 ml-s">
        <span className="text-xs font-code text-text-muted hidden sm:block">Admin Mode</span>
        <button
          onClick={handleLogout}
          className="text-[10px] sm:text-sm font-bold text-error sm:hover:text-fr-red/80 transition-colors uppercase cursor-pointer px-xs py-1 border border-error sm:border-0 rounded sm:rounded-none"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
