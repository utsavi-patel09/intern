import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { useDepartments } from "@/context/DepartmentContext";

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { departments, loading: depsLoading } = useDepartments();
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState<string>("manager");
  const [filterDepartment, setFilterDepartment] = useState<number | "">("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search,
        role: activeRole,
      });

      if (filterDepartment) {
        params.append("department", filterDepartment.toString());
      }

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      setUsers(data?.users || []);
      setTotalCount(data?.totalCount || 0);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, activeRole, filterDepartment]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      
      // Instead of manual removal, we should refresh to keep pagination counts accurate
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // When filters change, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [search, activeRole, filterDepartment]);

  return {
    users, // filtered implicitly by backend
    filteredUsers: users, // maintained for backward compatibility with components
    departments,
    loading: loading || depsLoading,
    search,
    setSearch,
    activeRole,
    setActiveRole,
    filterDepartment,
    setFilterDepartment,
    page,
    setPage,
    pageSize,
    totalCount,
    refreshUsers: fetchUsers,
    handleDeleteUser,
  };
}
