import { useState, useEffect, useCallback } from "react";
import { Intern, Department } from "@/types";

export function useInternProfile(userId: number | undefined) {
  const [intern, setIntern] = useState<Intern | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const internRes = await fetch(`/api/data?userId=${userId}`);
      const userIntern = await internRes.json();

      const deptRes = await fetch("/api/departments");
      const deptData = await deptRes.json();

      setDepartments(deptData.departments || []);

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
