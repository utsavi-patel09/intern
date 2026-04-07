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
    <div className="flex-1 w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Elements - Software Company Style */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-blue-100/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-sky-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] left-[10%] w-[100px] h-[100px] border border-slate-200/60 rounded-3xl rotate-12 bg-white/20"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[80px] h-[80px] border border-slate-200/60 rounded-full bg-white/20"></div>
      </div>

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white rounded-[2rem] p-8 sm:p-14 shadow-[0_8px_40px_rgba(30,41,59,0.08)] border border-slate-100 relative">
          
          {/* Header Branding */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-3xl bg-[#1E3A5F] flex items-center justify-center text-white shadow-xl shadow-blue-900/10 mx-auto mb-8 transition-transform hover:scale-105 cursor-pointer">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-black font-heading text-slate-950 tracking-tighter mb-3">
              Sign in
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4 text-red-700 animate-in fade-in slide-in-from-top-2">
              <div className="p-1 rounded-full bg-red-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-bold text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0EA5E9] transition-colors duration-300">
                  <svg className="w-6 h-6 border-r border-slate-200 pr-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  name="email"
                  type="email"
                  className={`w-full pl-16 pr-6 py-4.5 bg-slate-50 border-2 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-500/5 transition-all font-semibold shadow-sm ${formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-slate-100'}`}
                  placeholder="name@company.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-xs font-black mt-2 ml-1 flex items-center gap-1.5 animate-in slide-in-from-left-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {formik.errors.email}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center pl-1">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Password</label>
                <button 
                  type="button" 
                  onClick={() => {
                    setForgotError(null);
                    setForgotStep(1);
                    setResetEmail(formik.values.email || "");
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-black text-[#1E3A5F] hover:text-[#0EA5E9] transition-colors uppercase tracking-widest"
                 >
                   Forgot Password?
                 </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0EA5E9] transition-colors duration-300">
                  <svg className="w-6 h-6 border-r border-slate-200 pr-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type="password"
                  className={`w-full pl-16 pr-6 py-4.5 bg-slate-50 border-2 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-500/5 transition-all font-semibold shadow-sm ${formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-slate-100'}`}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-xs font-black mt-2 ml-1 flex items-center gap-1.5 animate-in slide-in-from-left-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-lg mt-4 shadow-2xl shadow-blue-900/20 rounded-[1.25rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal - Professional Redesign */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 sm:p-14 shadow-2xl relative border border-slate-100 overflow-hidden">
            
            {/* Modal Pattern Background */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
              <svg className="w-40 h-40" viewBox="0 0 200 200"><path fill="currentColor" d="M45,-78.2C58.3,-70.7,69.1,-58,76.4,-44C83.7,-30,87.6,-15,86.6,-0.6C85.5,13.8,79.5,27.5,71,39.4C62.5,51.3,51.4,61.4,38.6,69.1C25.8,76.8,11.2,82.1,-3.5,88.1C-18.1,94.1,-32.8,100.8,-45.5,96.6C-58.1,92.5,-68.8,77.5,-76.3,62.3C-83.8,47.1,-88.2,31.7,-88.1,16.5C-88.1,1.3,-83.5,-13.7,-77.2,-27.3C-70.9,-41,-62.9,-53.4,-51.7,-62.1C-40.4,-70.9,-25.9,-76,-11,-80.6C3.9,-85.2,18.8,-89.3,45,-78.2Z" transform="translate(100 100)" /></svg>
            </div>

            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative">
              <h3 className="text-3xl font-black font-heading text-slate-950 mb-3 tracking-tighter">Reset Password</h3>
              <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                {forgotStep === 1 && "Enter your email address to receive a verification OTP."}
                {forgotStep === 2 && "Enter the 6-digit verification code sent to your email."}
                {forgotStep === 3 && "Verification successful. Enter your new password below."}
              </p>

              {forgotError && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {forgotError}
                </div>
              )}

              {/* STEP 1: EMAIL */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">Email</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-500/5 transition-all font-semibold"
                      placeholder="name@company.com"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-5 text-sm font-black uppercase tracking-widest flex justify-center items-center rounded-2xl shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all">
                    {forgotLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {/* STEP 2: OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1 text-center block w-full">Verification Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      className="w-full px-6 py-6 text-center tracking-[0.5em] text-3xl bg-slate-50 border-2 border-slate-100 rounded-2xl text-[#0EA5E9] focus:outline-none focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-500/5 transition-all font-black"
                      placeholder="000000"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-5 text-sm font-black uppercase tracking-widest flex justify-center items-center rounded-2xl shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all">
                    {forgotLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              )}

              {/* STEP 3: NEW PASSWORD */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">New Password</label>
                    <input
                      name="newPassword"
                      type="password"
                      required
                      minLength={6}
                      className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-500/5 transition-all font-semibold"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest pl-1">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-[#0EA5E9] focus:ring-4 focus:ring-sky-500/5 transition-all font-semibold"
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-5 text-sm font-black uppercase tracking-widest flex justify-center items-center rounded-2xl shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all">
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
