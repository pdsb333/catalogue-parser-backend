"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import AdminCategoryTable from "./components/AdminCategoryTable";
import CategoryCreateModal from "./components/CategoryCreateModal";
import CategoryDeleteDialog from "./components/CategoryDeleteDialog";
import CategoryWithParsersView from "./components/CategoryWithParsersView";

import { categoriesApi } from "../utils/api";
import { CategorieRead, CategorieCreate, CategorieWithParsers } from "../utils/schema.ui";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorieRead[]>([]);
  const [categoriesWithParsers, setCategoriesWithParsers] = useState<CategorieWithParsers[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteDialogAttr, setDeleteDialogAttr] = useState<{isOpen: boolean, id: number | null, name: string}>({ isOpen: false, id: null, name: "" });

  const fetchData = async () => {
    try {
      const [catData, catTreeData] = await Promise.all([
        categoriesApi.getAllAdmin(),
        categoriesApi.getHierarchical()
      ]);
      setCategories(catData);
      setCategoriesWithParsers(catTreeData);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data: CategorieCreate) => {
    try {
      await categoriesApi.create(data);
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to create category", err);
      alert("Erreur lors de la création.");
    }
  };

  const handleEdit = (cat: CategorieRead) => {
    // Current API schema doesn't seem to have full edit supported in some places or is just PATCH name.
    console.log("Edit Category triggered:", cat);
  };

  const handleDeleteRequest = (id: number) => {
    const cat = categories.find(c => c.id === id);
    if (cat) {
      setDeleteDialogAttr({ isOpen: true, id, name: cat.name });
    }
  };

  const confirmDelete = async () => {
    if (!deleteDialogAttr.id) return;
    try {
      await categoriesApi.delete(deleteDialogAttr.id);
      setDeleteDialogAttr({ isOpen: false, id: null, name: "" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-xl">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-bg-alt pb-m">
          <div>
            <h1 className="text-3xl font-bold text-text uppercase tracking-tight">Catégories</h1>
            <p className="text-sm text-text-muted mt-1">Gérez l'arborescence de votre catalogue OAS 3.1</p>
          </div>
          <button 
            className="btn-primary shadow-sm w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Nouvelle Catégorie
          </button>
        </header>

        <section>
          <h2 className="text-lg font-bold flex items-center gap-s uppercase tracking-wider mb-m">
             <span className="h-3 w-1 bg-fr-blue"></span>
             Administration
          </h2>
          <div className="overflow-x-auto w-full border border-bg-alt rounded-sm">
            <AdminCategoryTable 
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          </div>
        </section>

        <section className="max-w-4xl">
          <h2 className="text-lg font-bold flex items-center gap-s uppercase tracking-wider mb-m">
             <span className="h-3 w-1 bg-text-muted"></span>
             Vue Hiérarchique (Lectures)
          </h2>
          <div className="space-y-s">
            {categoriesWithParsers.map((data) => (
              <CategoryWithParsersView key={data.name} category={data} />
            ))}
          </div>
        </section>
        
      </div>

      <CategoryCreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreate} 
      />
      
      <CategoryDeleteDialog 
        isOpen={deleteDialogAttr.isOpen} 
        categoryName={deleteDialogAttr.name} 
        onConfirm={confirmDelete} 
        onCancel={() => setDeleteDialogAttr({ isOpen: false, id: null, name: "" })} 
      />
    </AdminLayout>
  );
}
