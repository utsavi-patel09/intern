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
          ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50' 
          : 'bg-white/40 backdrop-blur-md shadow-sm border border-white/30'
      }`}>
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-slate-900 text-xl font-extrabold tracking-tight font-heading">
            Intern<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Hub</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-6">
          {/* Dashboard Link */}
          {dashboardLink.show && (
            <Link
              href={dashboardLink.href}
              className={`text-sm font-bold transition-colors relative group py-2 ${
                isActive(dashboardLink.href) ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {dashboardLink.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transform origin-left transition-transform duration-300 ${isActive(dashboardLink.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
            </Link>
          )}

          {/* Role specific direct links */}
          {role === "manager" && (
            <Link
              href="/manager/tasks"
              className={`text-sm font-bold transition-colors relative group py-2 ${
                isActive("/manager/tasks") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Assign Task
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transform origin-left transition-transform duration-300 ${isActive("/manager/tasks") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
            </Link>
          )}

          {role === "intern" && (
            <Link
              href="/intern/tasks"
              className={`text-sm font-bold transition-colors relative group py-2 ${
                isActive("/intern/tasks") ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Tasks
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transform origin-left transition-transform duration-300 ${isActive("/intern/tasks") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
            </Link>
          )}

          {/* Dropdown */}
          {dropdownLinks.some((link) => link.show) && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="text-sm font-bold text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors py-2 flex items-center gap-1"
              >
                Manage
                <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-white/50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  {dropdownLinks
                    .filter((link) => link.show)
                    .map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center shrink-0 border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                  <span className="text-indigo-600 text-sm font-black">
                    {initial}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-slate-900 text-sm font-bold leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-indigo-500 text-[10px] font-black uppercase tracking-wider mt-1">
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
                  className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100"
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
