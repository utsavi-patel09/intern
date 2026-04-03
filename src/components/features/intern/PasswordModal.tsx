interface PasswordModalProps {
  show: boolean;
  onClose: () => void;
  formik: any;
  loading: boolean;
}

export function PasswordModal({ show, onClose, formik, loading }: PasswordModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-[24px] shadow-2xl w-[90%] max-w-md animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          Change Password
        </h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              name="current_password"
              type="password"
              placeholder="Enter current password"
              value={formik.values.current_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-input bg-slate-50 focus:bg-white ${formik.touched.current_password && formik.errors.current_password ? 'border-red-300 ring-red-100' : ''}`}
            />
            {formik.touched.current_password && formik.errors.current_password && (
              <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.current_password}</p>
            )}
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input
              name="new_password"
              type="password"
              placeholder="Create a new strong password"
              value={formik.values.new_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-input bg-slate-50 focus:bg-white ${formik.touched.new_password && formik.errors.new_password ? 'border-red-300 ring-red-100' : ''}`}
            />
            {formik.touched.new_password && formik.errors.new_password && (
              <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.new_password}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
