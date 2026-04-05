import { useState, useEffect, useCallback } from "react";
import { Intern } from "@/types";
import { useDepartments } from "@/context/DepartmentContext";

export function useInternProfile(userId: number | undefined) {
  const [intern, setIntern] = useState<Intern | null>(null);
  const { departments, loading: depsLoading } = useDepartments();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const internRes = await fetch(`/api/data?userId=${userId}`);
      const userIntern = await internRes.json();

      if (!userIntern.error) {
        setIntern(userIntern);
      }
    } catch (err) {
      console.error("Load intern profile error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getDepartmentName = (id: number | null) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "Unassigned";
  };

  return {
    intern,
    departments,
    loading,
    editing,
    setEditing,
    getDepartmentName,
    refreshProfile: loadData,
  };
}
