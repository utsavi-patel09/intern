"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useInternProfile } from "@/hooks/useInternProfile";
import { useProfileForm } from "@/hooks/useProfileForm";
import { usePasswordForm } from "@/hooks/usePasswordForm";
import { ProfileCard } from "@/components/features/intern/ProfileCard";
import { ProfileDetails } from "@/components/features/intern/ProfileDetails";
import { PasswordModal } from "@/components/features/intern/PasswordModal";

export default function InternDashboard() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    intern,
    loading: dataLoading,
    editing,
    setEditing,
    getDepartmentName,
    refreshProfile,
  } = useInternProfile(userId);

  const { formik: profileFormik, loading: profileLoading } = useProfileForm({
    intern,
    onSuccess: () => {
      setEditing(false);
      refreshProfile();
    },
  });

  const { formik: passwordFormik, loading: passwordLoading } = usePasswordForm({
    userId,
    onSuccess: () => setShowPasswordModal(false),
  });

  if (!intern || dataLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">
          {dataLoading ? "Updating your profile..." : "Loading your profile..."}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">
            Welcome back, {intern.name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="btn-secondary flex items-center gap-2 bg-white/40 shadow-sm hover:bg-white/80"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </button>
        </div>
      </div>

      {/* BENTO GRID PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileCard
          intern={intern}
          departmentName={getDepartmentName(intern.department_id)}
        />
        <ProfileDetails
          intern={intern}
          editing={editing}
          setEditing={setEditing}
          formik={profileFormik}
          loading={profileLoading}
        />
      </div>

      {/* PASSWORD MODAL */}
      <PasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        formik={passwordFormik}
        loading={passwordLoading}
      />
    </div>
  );
}