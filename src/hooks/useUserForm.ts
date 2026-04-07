import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
      gender: "",
      start_date: "",
      end_date: "",
      stipend: null,
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Required"),

      email: Yup.string()
        .email("Invalid email format")
        .required("Required"),

      password: Yup.string()
        .test(
          "password-required",
          "Password is required for new users and must be 6+ characters",
          function (value) {
            if (editingUserId) return true; // not required for edit
            if (!value || value.length < 6) return false;
            return true;
          }
        ),

      role: Yup.string().required("Required"),

      department_id: Yup.number().nullable(),

      college: Yup.string().when("role", {
        is: "intern",
        then: (schema) => schema.required("College is required for interns"),
      }),

      stipend: Yup.number()
        .nullable()
        .when("role", {
          is: "intern",
          then: (schema) => schema.required("Stipend is required for interns").min(0, "Stipend must be positive"),
        }),

      start_date: Yup.string(),

      end_date: Yup.string().when("role", {
        is: "intern",
        then: (schema) => schema.required("End date is required for interns"),
      }),
    }),

    onSubmit: async (values) => {
      setCreateLoading(true);
      setApiError("");
      setEmailError("");

      try {
        const method = editingUserId ? "PUT" : "POST";

        const payload: any = {
          id: editingUserId,
          name: values.name,
          email: values.email,
          role: values.role,
        };

        // Only send password if it's new or being changed
        if (values.password && values.password.trim() !== "") {
          payload.password = values.password;
        }

        // Role-specific fields
        if (values.role === "intern") {
          payload.college = values.college || null;
          payload.gender = values.gender || null;
          payload.start_date = values.start_date || null;
          payload.end_date = values.end_date || null;
          payload.stipend = values.stipend ? parseInt(values.stipend.toString(), 10) : null;
          payload.department_id = values.department_id;
        } else if (values.role === "manager") {
          payload.department_id = values.department_id;
        }

        const res = await fetch("/api/users", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          const errMsg = data.error || "Operation failed";
          if (errMsg.toLowerCase().includes("email")) {
            setEmailError(errMsg);
          } else {
            setApiError(errMsg);
          }
          return;
        }

        onSuccess(data.user, !editingUserId);
        formik.resetForm();
      } catch (err) {
        console.error(err);
        setApiError("A network error occurred. Please try again.");
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
      password: "", // Clear for security, only update if typed
      role: user.role || "manager",
      department_id: user.department_id ?? null,
      college: user.intern?.college || "",
      gender: user.intern?.gender || "",
      start_date: user.intern?.start_date || "",
      end_date: user.intern?.end_date || "",
      stipend: user.intern?.stipend || null,
    });
  };

  const startCreating = (defaultRole: string) => {
    setEditingUserId(null);
    formik.resetForm({
      values: {
        name: "",
        email: "",
        password: "",
        role: defaultRole === "all" ? "manager" : defaultRole,
        department_id: null,
        college: "",
        gender: "",
        start_date: "",
        end_date: "",
        stipend: null,
      },
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