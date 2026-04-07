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
      phone_number: "",
      gender: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      phone_number: Yup.string().min(10, "Invalid phone number").required("Required"),
      gender: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      if (!intern) return;
      setLoading(true);
      try {
        const res = await fetch("/api/interns", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: intern.id, // This is the user ID in our combined mapping
            phone_number: values.phone_number,
            gender: values.gender,
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
        phone_number: intern.phone_number || "",
        gender: intern.gender || "",
      });
    }
  }, [intern]);

  return {
    formik,
    loading,
  };
}
