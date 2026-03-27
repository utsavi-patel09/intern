"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useUserForm } from "@/hooks/useUserForm";
import { UserFilters } from "@/components/features/admin/users/UserFilters";
import { UserTable } from "@/components/features/admin/users/UserTable";
import { UserFormModal } from "@/components/features/admin/users/UserFormModal";

export default function AdminUsers() {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    departments,
    loading,
    search,
    setSearch,
    activeRole,
    setActiveRole,
    filteredUsers,
    refreshUsers,
    handleDeleteUser,
  } = useAdminUsers();

  const {
    formik,
    createLoading,
    apiError,
    emailError,
    editingUserId,
    startEditing,
    startCreating,
  } = useUserForm({
    departments,
    onSuccess: () => {
      setShowAddForm(false);
      refreshUsers();
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">User Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              startCreating(activeRole);
              setShowAddForm(true);
            }}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* MODAL */}
      <UserFormModal
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        formik={formik}
        editingUserId={editingUserId}
        departments={departments}
        createLoading={createLoading}
        apiError={apiError}
        emailError={emailError}
      />

      {/* Users Table Container */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 mb-10">
        <UserFilters
          search={search}
          setSearch={setSearch}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          filteredCount={filteredUsers.length}
        />
        <UserTable
          users={filteredUsers}
          departments={departments}
          onEdit={(user) => {
            startEditing(user);
            setShowAddForm(true);
          }}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
}