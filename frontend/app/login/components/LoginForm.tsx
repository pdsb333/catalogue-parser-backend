"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // x-www-form-urlencoded expected by OAuth2 password flow
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");

    try {
      // Ajuster l'URL selon l'API backend exacte
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/login`, { 
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Identifiants invalides ou erreur serveur.");
      }

      const data = await res.json();
      // On sauvegarde le token pour les requêtes futures
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        // Redirection vers le dashboard
        router.push("/categories");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  return (
    <div className="card-fr max-w-sm w-full bg-bg border border-bg-alt shadow-card p-l mx-auto mt-20">
      <div className="mb-l text-center">
        <h1 className="text-2xl font-bold font-main text-text">Catalogue Parser API</h1>
        <p className="text-xs text-text-muted mt-2 font-code uppercase tracking-widest">
          Administration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-m">
        {error && (
          <div className="bg-error/10 border-l-4 border-error p-s text-sm text-error font-bold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold uppercase text-text-muted tracking-tight">Email Administrateur</label>
          <input
            type="email"
            required
            className="border border-bg-alt p-m focus:border-fr-blue outline-none bg-bg transition-all font-main"
            placeholder="admin@example.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="text-xs font-bold uppercase text-text-muted tracking-tight">Mot de Passe</label>
          <input
            type="password"
            required
            className="border border-bg-alt p-m focus:border-fr-blue outline-none bg-bg transition-all font-main"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-m shadow-md cursor-pointer mt-s"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
