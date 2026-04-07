import { Intern } from "@/types";

interface ProfileDetailsProps {
  intern: Intern;
  editing: boolean;
  setEditing: (value: boolean) => void;
  formik: any;
  loading: boolean;
}

export function ProfileDetails({ intern, editing, setEditing, formik, loading }: ProfileDetailsProps) {
  return (
    <div className="md:col-span-2 card-glass bg-white/60 flex flex-col shadow-sm">
      <div className="px-8 py-5 border-b border-slate-200/50 flex justify-between items-center bg-white/40 backdrop-blur-sm rounded-t-[24px]">
        <h2 className="section-title text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Personal Details
        </h2>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-1.5 focus:ring-2 focus:ring-sky-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditing(false);
                formik.resetForm();
              }}
              className="btn-secondary py-1.5 px-3 text-sm bg-white hover:bg-slate-50 focus:ring-2 focus:ring-slate-500/20"
            >
              Cancel
            </button>
            <button onClick={() => formik.handleSubmit()} disabled={loading} className="btn-primary py-1.5 px-4 text-sm shadow-md flex items-center gap-2 disabled:opacity-70 focus:ring-2 focus:ring-sky-500/50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 content-start">
        {/* College */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            College / University
          </label>
          <p className="text-lg font-semibold text-slate-800">{intern.college || "Not specified"}</p>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Phone Number
          </label>
          {editing ? (
            <div className="flex flex-col gap-1.5">
              <input
                name="phone_number"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input bg-white/80 ${formik.touched.phone_number && formik.errors.phone_number ? 'border-red-300 ring-red-100' : ''}`}
                placeholder="Enter 10 digit number"
              />
              {formik.touched.phone_number && (
                <>
                  {formik.errors.phone_number && (
                    <p className="text-red-500 text-xs font-bold">{formik.errors.phone_number}</p>
                  )}
                  {!/^[0-9]{10}$/.test(formik.values.phone_number) && !formik.errors.phone_number && (
                    <p className="text-amber-600 text-xs font-semibold">Phone number must be exactly 10 digits</p>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-lg font-semibold text-slate-800">{intern.phone_number || "Not specified"}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Gender
          </label>
          {editing ? (
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-select bg-white/80 ${formik.touched.gender && formik.errors.gender ? 'border-red-300 ring-red-100' : ''}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-lg font-semibold text-slate-800">{intern.gender || "Not specified"}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Start Date
          </label>
          <p className="text-lg font-semibold text-slate-800">{intern.start_date ? new Date(intern.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Not specified"}</p>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            End Date
          </label>
          <p className="text-lg font-semibold text-slate-800">{intern.end_date ? new Date(intern.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Not specified"}</p>
        </div>

        {/* Stipend */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Stipend (₹)
          </label>
          <p className="text-lg font-semibold text-slate-800">{intern.stipend ? `₹${intern.stipend}` : "Not specified"}</p>
        </div>
      </div>
    </div>
  );
}
