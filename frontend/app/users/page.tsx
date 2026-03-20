"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import UserTable from "./components/UserTable";
import UserCreateForm from "./components/UserCreateForm";
import UserEditForm from "./components/UserEditForm";
import UserDeleteAction from "./components/UserDeleteAction";

import { usersApi } from "../utils/api";
import type { UserOut, UserIn, UserUpdate } from "../utils/schema.ui";

export default function UsersPage() {
  const [users, setUsers] = useState<UserOut[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<UserOut | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (data: UserIn) => {
    try {
      await usersApi.create(data);
      setIsCreating(false);
      fetchUsers();
    } catch (err) {
      console.error("Failed to create user", err);
      alert("Erreur lors de la création.");
    }
  };

  const handleEdit = async (data: UserUpdate) => {
    if (!editingUser) return;
    try {
      await usersApi.update(editingUser.email, data);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async () => {
    if (!deletingEmail) return;
    try {
      await usersApi.delete(deletingEmail);
      setDeletingEmail(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-xl max-w-4xl">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-bg-alt pb-m">
          <div>
            <h1 className="text-3xl font-bold text-text uppercase tracking-tight">Utilisateurs</h1>
            <p className="text-sm text-text-muted mt-1">Gérez les accès à l'API</p>
          </div>
          <button 
            className="btn-primary shadow-sm w-full sm:w-auto"
            onClick={() => setIsCreating(true)}
          >
            + Nouvel Utilisateur
          </button>
        </header>

        <section>
          <h2 className="text-lg font-bold flex items-center gap-s uppercase tracking-wider mb-m">
             <span className="h-3 w-1 bg-fr-blue"></span>
             Liste des administrateurs
          </h2>
          <div className="overflow-x-auto w-full border border-bg-alt rounded-sm">
            <UserTable 
              users={users} 
              onEdit={(user) => setEditingUser(user)} 
              onDelete={(email) => setDeletingEmail(email)} 
            />
          </div>
        </section>
      </div>

      <UserCreateForm 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        onSubmit={handleCreate} 
      />

      <UserEditForm 
        initialData={editingUser} 
        onClose={() => setEditingUser(null)} 
        onSubmit={handleEdit} 
      />

      <UserDeleteAction 
        isOpen={!!deletingEmail} 
        email={deletingEmail || ""} 
        onConfirm={handleDelete} 
        onCancel={() => setDeletingEmail(null)} 
      />
    </AdminLayout>
  );
}
