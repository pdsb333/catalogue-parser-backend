"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg font-main text-text flex flex-col md:flex-row">
      <Navbar />
      <Sidebar />
      <main className="flex-1 w-full mt-16 mb-16 md:mb-0 md:ml-64 p-m sm:p-l">
        {children}
      </main>
    </div>
  );
}
