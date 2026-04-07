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

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1 = Email, 2 = OTP, 3 = New Pass
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

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

  // Forgot Password API Calls
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err.message || "Failed to send OTP");
    }
    setForgotLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgotStep(3);
    } catch (err: any) {
      setForgotError(err.message || "Invalid or expired OTP");
    }
    setForgotLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPassword = (e.target as any).newPassword.value;
    const confirmPassword = (e.target as any).confirmPassword.value;
    
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    setForgotError(null);
    setForgotLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Success!
      setShowForgotModal(false);
      setForgotStep(1);
      formik.setFieldValue("email", resetEmail);
      alert("Password reset successfully. Please sign in with your new password.");
    } catch (err: any) {
      setForgotError(err.message || "Failed to reset password");
    }
    setForgotLoading(false);
  };


  return (
    <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden z-10">

      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] pointer-events-none -z-10">
        <div className="absolute inset-0 bg-sky-500/[0.06] blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden animate-in zoom-in-95 duration-700">

        {/* Subtle top reflection */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#1E3A5F] to-[#0EA5E9] flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
          <div className="mb-6 p-4 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="group">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2 block group-focus-within:text-[#1E3A5F] transition-colors">Email Address <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0EA5E9] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                name="email"
                type="text"
                className={`w-full pl-12 pr-4 py-3.5 bg-white/70 border rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/15 focus:border-sky-400 transition-all font-medium backdrop-blur-sm shadow-sm ${formik.touched.email && formik.errors.email ? 'border-red-300 ring-red-100' : 'border-slate-200/80'}`}
                placeholder="name@company.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider group-focus-within:text-[#1E3A5F] transition-colors">Password <span className="text-red-500">*</span></label>
              <button 
                type="button" 
                onClick={() => {
                  setForgotError(null);
                  setForgotStep(1);
                  setResetEmail(formik.values.email || "");
                  setShowForgotModal(true);
                }}
                className="text-xs font-bold text-sky-600 hover:text-[#1E3A5F] transition-colors"
               >
                 Forgot Password?
               </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0EA5E9] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                name="password"
                type="password"
                className={`w-full pl-12 pr-4 py-3.5 bg-white/70 border rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/15 focus:border-sky-400 transition-all font-medium backdrop-blur-sm shadow-sm ${formik.touched.password && formik.errors.password ? 'border-red-300 ring-red-100' : 'border-slate-200/80'}`}
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-4 text-base mt-2 shadow-lg shadow-[#1E3A5F]/20 rounded-2xl font-bold flex items-center justify-center gap-2"
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-black font-heading text-slate-900 mb-2">Reset Password</h3>
            <p className="text-slate-500 mb-6 text-sm">
              {forgotStep === 1 && "Enter your email address and we'll send you an OTP."}
              {forgotStep === 2 && "Enter the 6-digit OTP sent to your email."}
              {forgotStep === 3 && "Enter your new password."}
            </p>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {forgotError}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition-all font-medium"
                    placeholder="name@company.com"
                  />
                </div>
                <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-3.5 text-sm font-bold flex justify-center items-center">
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Enter OTP <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full px-4 py-3 text-center tracking-[0.5em] text-2xl bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition-all font-bold"
                    placeholder="------"
                  />
                </div>
                <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-3.5 text-sm font-bold flex justify-center items-center">
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">New Password <span className="text-red-500">*</span></label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Confirm Password <span className="text-red-500">*</span></label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-3.5 text-sm font-bold flex justify-center items-center">
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
