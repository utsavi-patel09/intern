"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        const session = await fetch("/api/auth/session").then((r) => r.json());
        const role = session?.user?.role;
        if (role === "admin") router.push("/admin");
        else if (role === "manager") router.push("/manager");
        else router.push("/intern");
      }
    },
  });

  //handleLogin logic moved to formik

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden z-10">

      {/* GLOWING ORB ACCENTS SPECIFIC TO LOGIN */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] pointer-events-none -z-10">
        <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden animate-in zoom-in-95 duration-700">

        {/* Subtle top reflection */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black font-heading text-slate-900 tracking-tight mb-2">
            Sign in
          </h2>
          <p className="text-slate-500 font-medium">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50/80 backdrop-blur-sm border border-rose-100 flex items-start gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="group">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2 block group-focus-within:text-indigo-600 transition-colors">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                name="email"
                type="text"
                className={`w-full pl-12 pr-4 py-3.5 bg-white/60 border rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium backdrop-blur-sm shadow-sm ${formik.touched.email && formik.errors.email ? 'border-rose-300 ring-rose-100' : 'border-white/80'}`}
                placeholder="name@company.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                name="password"
                type="password"
                className={`w-full pl-12 pr-4 py-3.5 bg-white/60 border rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium backdrop-blur-sm shadow-sm ${formik.touched.password && formik.errors.password ? 'border-rose-300 ring-rose-100' : 'border-white/80'}`}
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-4 text-base mt-2 shadow-lg shadow-indigo-500/25 rounded-2xl font-bold flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
