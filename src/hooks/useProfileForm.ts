import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Intern } from "@/types";

interface UseProfileFormProps {
  intern: Intern | null;
  onSuccess: () => void;
}

export function useProfileForm({ intern, onSuccess }: UseProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      college: "",
      phone_number: "",
      start_date: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      college: Yup.string().required("Required"),
      phone_number: Yup.string().min(10, "Invalid phone number").required("Required"),
      start_date: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      if (!intern) return;
      setLoading(true);
      try {
        const res = await fetch("/api/interns", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: intern.id,
            college: values.college,
            phone_number: values.phone_number,
            start_date: values.start_date,
          }),
        });
        const data = await res.json();
        if (!data.error) {
          onSuccess();
        } else {
          alert("Update failed: " + (data.error || "Unknown Error"));
        }
      } catch (err) {
        console.error("Profile update error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (intern) {
      formik.setValues({
        college: intern.college || "",
        phone_number: intern.phone_number || "",
        start_date: intern.start_date?.split('T')[0] || "",
      });
    }
  }, [intern]);

  return {
    formik,
    loading,
  };
}
