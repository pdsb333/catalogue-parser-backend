"use client";

import { useState, useEffect } from "react";
import { parsersApi, categoriesApi } from "../utils/api";
import { CategorieRead, ParserRead, ParserCreate, CategorieWithParsers } from "../utils/schema.ui";

// Composants Catégories
import CategoryCard from "./components/categoryCard";
import AdminCategoryTable from "./components/categoryTable";
import CategoryDeleteDialog from "./components/categoryDelete";
import CategoryWithParsersView from "./components/categoryWithParserView";

// Composants Parsers
import ParserList from "./components/parserList";
import ParserAdminTable from "./components/parserAdminTable";
import ParserUpsertForm from "./components/parserUpsertForm";

export default function FactoryPage() {
  // --- ÉTATS ---
  const [categories, setCategories] = useState<CategorieRead[]>([]);
  const [categoriesWithParsers, setCategoriesWithParsers] = useState<CategorieWithParsers[]>([]);
  const [parsers, setParsers] = useState<ParserRead[]>([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategorieRead | null>(null);
  
  const [editingParser, setEditingParser] = useState<ParserRead | null>(null);
  const [isCreatingParser, setIsCreatingParser] = useState(false);

  const [parserOffset, setParserOffset] = useState(0);
  const PARSER_LIMIT = 10;

  const fetchData = async () => {
    try {
      const [catData, catTreeData, parserData] = await Promise.all([
        categoriesApi.getAllAdmin(),
        categoriesApi.getHierarchical(),
        parsersApi.getAllAdmin(PARSER_LIMIT, parserOffset)
      ]);
      setCategories(catData);
      setCategoriesWithParsers(catTreeData);
      setParsers(parserData);
    } catch (err) {
      console.error("Failed to fetch factory data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parserOffset]);

  // --- HANDLERS ---
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
      fetchData();
    } catch (err) {
      console.error("Failed to save parser", err);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const prepareDeleteCat = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCat(category);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDeleteCat = async () => {
    if (!selectedCat) return;
    try {
      await categoriesApi.delete(selectedCat.id);
      setIsDeleteDialogOpen(false);
      setSelectedCat(null);
      fetchData();
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleDeleteParser = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce parser ?")) return;
    try {
      await parsersApi.delete(id);
      fetchData();
    } catch (err) {
      console.error("Failed to delete parser", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <main className="min-h-full bg-bg-alt p-l font-main space-y-xl">
      
      {/* 1. ADMINISTRATION & FORMULAIRE */}
      <section className="bg-bg p-m border border-bg-alt shadow-sm">
        <header className="mb-l flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-bg-alt pb-m">
          <div>
            <h1 className="text-2xl font-bold text-text">Administration</h1>
            <p className="text-xs text-text-muted italic">Gestion des schémas et catégories</p>
          </div>
          <button className="btn-primary w-full sm:w-auto" onClick={() => setIsCreatingParser(true)}>
            + Nouveau Parser
          </button>
        </header>

        {/* Zone de formulaire dynamique */}
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

        <AdminCategoryTable 
          categories={categories} 
          onEdit={(cat) => console.log("Edit Cat:", cat.name)} 
          onDelete={prepareDeleteCat} 
        />
      </section>

      {/* 2. VUE HIÉRARCHIQUE (Accordéons) */}
      <section className="max-w-4xl">
        <h2 className="mb-m text-lg font-bold flex items-center gap-s uppercase tracking-wider">
           <span className="h-3 w-1 bg-fr-blue"></span>
           Structure du Catalogue
        </h2>
        <div className="space-y-s">
          {categoriesWithParsers.map((data) => (
            <CategoryWithParsersView key={data.id} category={data} />
          ))}
        </div>
      </section>

      {/* 3. FLUX DES PARSERS (Tableau technique) */}
      <section className="bg-bg border border-bg-alt p-m rounded-sm shadow-sm">
        <div className="flex justify-between items-center mb-m">
          <h2 className="text-lg font-bold text-text uppercase tracking-tight">
            Base de données des Parsers
          </h2>
        </div>

        <ParserAdminTable 
          parsers={parsers} 
          onEdit={handleEditParser}
          onDelete={handleDeleteParser}
        />
      </section>

      {/* 4. LISTE PAGINÉE (Vue alternative) */}
      <section className="bg-bg border border-bg-alt p-m rounded-sm">
        <h2 className="text-lg font-bold text-text mb-m uppercase tracking-tight">Flux d'activité</h2>
        <ParserList 
          parsers={parsers} 
          limit={PARSER_LIMIT} 
          offset={parserOffset} 
          onPageChange={(newOffset) => setParserOffset(newOffset)}
          onEdit={handleEditParser}
        />
      </section>

      {/* MODALES */}
      <CategoryDeleteDialog 
        isOpen={isDeleteDialogOpen}
        categoryName={selectedCat?.name || ""}
        onConfirm={handleConfirmDeleteCat}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </main>
  );
}