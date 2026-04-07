import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UsePasswordFormProps {
  userId: number | undefined;
  onSuccess: () => void;
}

export function usePasswordForm({ userId, onSuccess }: UsePasswordFormProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required("Required"),
      new_password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch("/api/users/change-password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            current_password: values.current_password,
            new_password: values.new_password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          onSuccess();
          formik.resetForm();
        } else {
          alert(data.error || "Password update failed");
        }
      } catch (err) {
        console.error("Password update error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    formik,
    loading,
  };
}
