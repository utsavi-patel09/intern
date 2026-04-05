import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { useDepartments } from "@/context/DepartmentContext";

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { departments, loading: depsLoading } = useDepartments();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState<string>("manager");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data?.users || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    if (!u) return false;
    if (u.role === 'admin') return false;
    if (activeRole !== 'all' && u.role !== activeRole) return false;
    
    const name = u.name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  return {
    users,
    departments,
    loading,
    search,
    setSearch,
    activeRole,
    setActiveRole,
    filteredUsers,
    refreshUsers: fetchUsers,
    handleDeleteUser,
  };
}
