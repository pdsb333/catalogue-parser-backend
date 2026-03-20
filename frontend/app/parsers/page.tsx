"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import ParserList from "./components/ParserList";
import ParserAdminTable from "./components/ParserAdminTable";
import ParserUpsertForm from "./components/ParserUpsertForm";

import { parsersApi, categoriesApi } from "../utils/api";
import { ParserRead, ParserCreate, CategorieRead } from "../utils/schema.ui";

export default function ParsersPage() {
  const [parsers, setParsers] = useState<ParserRead[]>([]);
  const [categories, setCategories] = useState<CategorieRead[]>([]);
  const [editingParser, setEditingParser] = useState<ParserRead | null>(null);
  const [isCreatingParser, setIsCreatingParser] = useState(false);
  
  const [parserOffset, setParserOffset] = useState(0);
  const PARSER_LIMIT = 10;

  const fetchData = async () => {
    try {
      const [parsersData, categoriesData] = await Promise.all([
        parsersApi.getAllAdmin(PARSER_LIMIT, parserOffset),
        categoriesApi.getAllAdmin()
      ]);
      setParsers(parsersData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parserOffset]);

  const handleEditParser = (parser: ParserRead) => {
    setEditingParser(parser);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveParser = async (data: ParserCreate) => {
    try {
      if (editingParser) {
        await parsersApi.update(editingParser.id, data);
      } else {
        await parsersApi.create(data);
      }
      setEditingParser(null);
      setIsCreatingParser(false);
      fetchData(); // Refresh list after save
    } catch (err) {
      console.error("Failed to save parser", err);
      alert("Erreur lors de la sauvegarde du Parser.");
    }
  };

  const handleDeleteParser = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce parser ?")) return;
    try {
      await parsersApi.delete(id);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Failed to delete parser", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-xl">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-bg-alt pb-m">
          <div>
            <h1 className="text-3xl font-bold text-text uppercase tracking-tight">Parsers</h1>
            <p className="text-sm text-text-muted mt-1">Gestion des extracteurs de catalogue</p>
          </div>
          <button 
            className="btn-primary shadow-sm w-full sm:w-auto"
            onClick={() => setIsCreatingParser(true)}
          >
            + Nouveau Parser
          </button>
        </header>

        {(editingParser || isCreatingParser) && (
          <div className="mb-xl p-m border-l-4 border-fr-blue bg-bg-alt/10 animate-in fade-in slide-in-from-top-4">
             <ParserUpsertForm 
                initialData={editingParser}
                categories={categories}
                onCancel={() => { setEditingParser(null); setIsCreatingParser(false); }}
                onSubmit={handleSaveParser}
             />
          </div>
        )}

        <section>
          <h2 className="text-lg font-bold flex items-center gap-s uppercase tracking-wider mb-m">
             <span className="h-3 w-1 bg-fr-blue"></span>
             Base de données des Parsers
          </h2>
          <ParserAdminTable 
            parsers={parsers} 
            onEdit={handleEditParser}
            onDelete={handleDeleteParser}
          />
        </section>

        <section className="bg-bg border border-bg-alt p-m rounded-sm max-w-4xl">
          <h2 className="text-lg font-bold text-text mb-m uppercase tracking-tight">Vue paginée</h2>
          <ParserList 
            parsers={parsers} 
            limit={PARSER_LIMIT} 
            offset={parserOffset} 
            onPageChange={(newOffset) => setParserOffset(newOffset)}
            onEdit={handleEditParser}
          />
        </section>
      </div>
    </AdminLayout>
  );
}
