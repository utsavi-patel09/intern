"use client";

import { useState, useEffect } from "react";
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
    filterDepartment,
    setFilterDepartment,
    users,
    filteredUsers,
    page,
    setPage,
    pageSize,
    totalCount,
    refreshUsers,
    handleDeleteUser,
  } = useAdminUsers();

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

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
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">
            {activeRole === "manager" || activeRole === "" ? "User Management" : `${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Management`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              startCreating(activeRole);
              setShowAddForm(true);
            }}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-[#1E3A5F]/20 transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            {activeRole === "manager" || activeRole === "" ? "Add User" : `Add ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
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
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 mb-10">
        <UserFilters
          search={search}
          setSearch={setSearch}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          filterDepartment={filterDepartment}
          setFilterDepartment={setFilterDepartment}
          departments={departments}
          filteredCount={totalCount}
        />
        <UserTable
          users={users}
          departments={departments}
          onEdit={(user) => {
            startEditing(user);
            setShowAddForm(true);
          }}
          onDelete={handleDeleteUser}
        />
        {totalCount > 0 && (
          <div className="px-6 py-4 border-t border-slate-200/60 bg-white/50 backdrop-blur-md flex justify-between items-center rounded-b-2xl">
            <span className="text-sm text-slate-500 font-medium">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} users
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-50 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page * pageSize >= totalCount}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold disabled:opacity-50 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}