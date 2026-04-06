"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Department } from "@/types"; // Make sure Department type is exported from @/types

interface DepartmentContextType {
  departments: Department[];
  loading: boolean;
  refreshDepartments: () => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function DepartmentProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { status } = useSession();

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(data?.departments || []);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDepartments();
    }
  }, [fetchDepartments, status]);

  return (
    <DepartmentContext.Provider value={{ departments, loading, refreshDepartments: fetchDepartments }}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartments() {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error("useDepartments must be used within a DepartmentProvider");
  }
  return context;
}
