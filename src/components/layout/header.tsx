"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300" />
        {/* Logo */}
        <div className="relative size-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ring-1 ring-white/10">
          <span className="text-white font-bold text-[15px] tracking-tight">KF</span>
        </div>
      </div>
      <span className="font-semibold hidden sm:inline-block text-[15px] text-white/90 group-hover:text-white transition-colors">
        {SITE_NAME}
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { theme, setTheme } = useTheme();
  const isHome = pathname === "/";
  const showSolid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showSolid
          ? "bg-[#0A1228]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav
          className={cn(
            "hidden md:flex items-center gap-0.5 rounded-full px-1.5 py-1 border transition-colors duration-300",
            showSolid
              ? "bg-white/[0.06] border-white/[0.08]"
              : "bg-white/[0.04] border-white/[0.06]"
          )}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "text-white bg-white/10"
                    : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
            aria-label="Search"
          >
            <Search className="size-[18px]" />
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="size-[18px] hidden dark:block" />
            <Moon className="size-[18px] dark:hidden" />
          </button>
          <Link
            href="/login"
            className="text-[13px] font-medium text-white/60 hover:text-white transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-[13px] font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 rounded-full transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            Join Community
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1228]/95 backdrop-blur-xl border-t border-white/[0.06]">
          <nav className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center text-sm font-medium text-white/60 hover:text-white border border-white/10 rounded-lg py-2.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg py-2.5 transition-colors"
              >
                Join
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
