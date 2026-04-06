import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import { User, UserFormData } from "@/types";

interface UseUserFormProps {
  onSuccess: (user: User, isNew: boolean) => void;
  departments: { id: number; name: string }[];
}

export function useUserForm({ onSuccess, departments }: UseUserFormProps) {
  const [createLoading, setCreateLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const formik = useFormik<UserFormData>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "manager",
      department_id: null,
      college: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3, "Name must be at least 3 characters").required("Required"),
      email: Yup.string().email("Invalid email format").required("Required"),
      password: Yup.string()
        .test("password-required", "Password is required", (value) => {
          if (!editingUserId && !value) return false;
          return true;
        })
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[@$!%*?&]/, "Must contain at least one special character"),
      role: Yup.string().required("Required"),
      department_id: Yup.number().nullable(),
      college: Yup.string().when("role", {
        is: "intern",
        then: (schema) => schema.required("College is required for interns"),
      }),
    }),
    onSubmit: async (values) => {
      setCreateLoading(true);
      setApiError("");
      setEmailError("");

      try {
        let hashedPassword = values.password;
        if (values.password) {
          hashedPassword = await bcrypt.hash(values.password, 10);
        }

        const method = editingUserId ? "PUT" : "POST";
        const payload: any = {
          name: values.name,
          email: values.email,
          role: values.role,
        };

        if (values.role === "intern") payload.college = values.college;
        if (hashedPassword) payload.password = hashedPassword;
        
        if (values.role === "admin") {
          payload.department_id = null;
        } else if (values.department_id !== null) {
          payload.department_id = values.department_id;
        }
        
        if (editingUserId) payload.id = editingUserId;

        const res = await fetch("/api/users", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data?.error?.toLowerCase().includes("email")) {
            setEmailError(data.error);
          } else {
            setApiError(data.error || "Operation failed");
          }
          return;
        }

        onSuccess(data.user, !editingUserId);
        formik.resetForm();
      } catch (err) {
        console.error(err);
        setApiError("Something went wrong");
      } finally {
        setCreateLoading(false);
      }
    },
  });

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    formik.setValues({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "manager",
      department_id: user.department_id,
      college: user.intern?.college || "",
    });
  };

  const startCreating = (defaultRole: string) => {
    setEditingUserId(null);
    formik.resetForm({
      values: {
        name: "",
        email: "",
        password: "",
        role: defaultRole === 'all' ? 'manager' : defaultRole,
        department_id: null,
        college: "",
      }
    });
  };

  return {
    formik,
    createLoading,
    apiError,
    emailError,
    editingUserId,
    startEditing,
    startCreating,
  };
}
