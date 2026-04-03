"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/layout/LogoutButton";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const initial = session?.user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const role = session?.user?.role;

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  const dashboardLink = {
    name: "Dashboard",
    href:
      session?.user?.role === "admin"
        ? "/admin"
        : session?.user?.role === "manager"
        ? "/manager"
        : "/intern",
    show: status === "authenticated",
  };

  const dropdownLinks = [
    { name: "Analytics", href: "/admin/dashboard", show: role === "admin" },
    { name: "Manage Users", href: "/admin/users", show: role === "admin" },
    { name: "Manage Interns", href: "/admin/interns", show: role === "admin" },
    { name: "Manage Departments", href: "/admin/departments", show: role === "admin" },
    { name: "Assign Task", href: "/manager/tasks", show: false },
    { name: "Tasks", href: "/intern/tasks", show: false },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:px-6 lg:px-8 pointer-events-none">
      <nav className={`pointer-events-auto w-full max-w-7xl h-16 rounded-2xl transition-all duration-300 flex items-center justify-between px-6 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-200/60' 
          : 'bg-white/50 backdrop-blur-md shadow-sm border border-slate-200/40'
      }`}>
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#0EA5E9] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-slate-900 text-xl font-extrabold tracking-tight font-heading">
            Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A5F] to-[#0EA5E9]">Hub</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dashboard Link */}
          {dashboardLink.show && (
            <Link
              href={dashboardLink.href}
              className={`text-sm font-bold transition-colors relative group py-2 ${
                isActive(dashboardLink.href) ? "text-[#1E3A5F]" : "text-slate-500 hover:text-[#1E3A5F]"
              }`}
            >
              {dashboardLink.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#0EA5E9] rounded-full transform origin-left transition-transform duration-300 ${isActive(dashboardLink.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
            </Link>
          )}

          {/* Role specific direct links */}
         {role === "manager" && (
          <>
            <Link
              href="/manager/tasks"
              className={`text-sm font-bold transition-colors relative group py-2 ${
                isActive("/manager/tasks")
                  ? "text-[#1E3A5F]"
                  : "text-slate-500 hover:text-[#1E3A5F]"
              }`}
            >
              Assign Task
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#0EA5E9] rounded-full transform origin-left transition-transform duration-300 ${
                  isActive("/manager/tasks")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </Link>

            <Link
              href="/manager/leaves"
              className={`text-sm font-bold transition-colors relative group py-2 ${
                isActive("/manager/leaves")
                  ? "text-[#1E3A5F]"
                  : "text-slate-500 hover:text-[#1E3A5F]"
              }`}
            >
              Manage Leaves
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#0EA5E9] rounded-full transform origin-left transition-transform duration-300 ${
                  isActive("/manager/leaves")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </Link>
          </>
        )}

          {role === "intern" && (
              <>
                <Link
                  href="/intern/tasks"
                  className={`text-sm font-bold transition-colors relative group py-2 ${
                    isActive("/intern/tasks")
                      ? "text-[#1E3A5F]"
                      : "text-slate-500 hover:text-[#1E3A5F]"
                  }`}
                >
                  Tasks
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#0EA5E9] rounded-full transform origin-left transition-transform duration-300 ${
                      isActive("/intern/tasks")
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>

                <Link
                  href="/intern/leaves"
                  className={`text-sm font-bold transition-colors relative group py-2 ${
                    isActive("/intern/leaves")
                      ? "text-[#1E3A5F]"
                      : "text-slate-500 hover:text-[#1E3A5F]"
                  }`}
                >
                  Leaves
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#0EA5E9] rounded-full transform origin-left transition-transform duration-300 ${
                      isActive("/intern/leaves")
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  ></span>
                </Link>
              </>
            )}

          {/* Dropdown */}
          {dropdownLinks.some((link) => link.show) && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="text-sm font-bold text-slate-500 cursor-pointer hover:text-[#1E3A5F] transition-colors py-2 flex items-center gap-1"
              >
                Manage
                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/60 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  {dropdownLinks
                    .filter((link) => link.show)
                    .map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-[#1E3A5F] transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}

          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-5">
              <LogoutButton />
              <div className="flex items-center gap-3 pl-5 border-l border-slate-200/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#0EA5E9] flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                  <span className="text-white text-sm font-black">
                    {initial}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-slate-900 text-sm font-bold leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-sky-600 text-[10px] font-black uppercase tracking-wider mt-1">
                    {role}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              {pathname !== "/" && (
                <Link
                  href="/"
                  className="text-sm font-bold text-slate-500 hover:text-[#1E3A5F] transition-colors px-4 py-2 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-100"
                >
                  Home
                </Link>
              )}
              {pathname !== "/login" && (
                <Link
                  href="/login"
                  className="btn-primary btn-sm rounded-xl px-5"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
