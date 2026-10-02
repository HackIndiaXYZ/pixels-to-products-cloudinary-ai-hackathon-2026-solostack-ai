"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  const closeMenu = useCallback(() => setOpen(false), []);

  // Smoothly scroll to in-page sections without adding extra navigation work.
  const handleSectionClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      closeMenu();

      const target = document.getElementById(id);
      if (!target) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      // Keep the URL shareable without triggering a Next.js navigation.
      window.history.replaceState(null, "", `#${id}`);
    },
    [closeMenu]
  );

  // Close mobile menu on Escape key press.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeMenu]);

  // Lock body scroll only while the mobile menu is open.
  // Preserve the scrollbar width to avoid a horizontal layout jump.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      return;
    }

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  return (
    <header className="navbar-wrap">
      <div className="container">
        <nav className="navbar" aria-label="Main Navigation">
          {/* Logo */}
          <Link href="/" className="logo" onClick={closeMenu}>
            <span className="logo-mark" />
            <span className="logo-text">
              MediaGuard <span>AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            <a href="#features" className="nav-link" onClick={(event) => handleSectionClick(event, "features")}>
              Features
            </a>

            <a href="#how-it-works" className="nav-link" onClick={(event) => handleSectionClick(event, "how-it-works")}>
              How it works
            </a>

            <a href="#cloudinary" className="nav-link" onClick={(event) => handleSectionClick(event, "cloudinary")}>
              Cloudinary
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {!isLoaded ? (
              // Skeleton placeholder during initial load
              <div style={{ width: 120, height: 36 }} />
            ) : isSignedIn ? (
              <>
                <Link href="/dashboard" className="btn btn-secondary nav-dashboard">
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "navbar-avatar",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="btn btn-secondary nav-signin">
                  Sign in
                </Link>

                <Link href="/sign-up" className="btn btn-primary nav-cta">
                  Get started
                  <ArrowIcon />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* Mobile Menu Dropdown */}
          {open && (
            <div className="mobile-menu">
              <a href="#features" onClick={(event) => handleSectionClick(event, "features")}>
                Features
              </a>

              <a href="#how-it-works" onClick={(event) => handleSectionClick(event, "how-it-works")}>
                How it works
              </a>

              <a href="#cloudinary" onClick={(event) => handleSectionClick(event, "cloudinary")}>
                Cloudinary
              </a>

              {isLoaded && isSignedIn ? (
                <Link href="/dashboard" className="mobile-cta" onClick={closeMenu}>
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" onClick={closeMenu}>
                    Sign in
                  </Link>

                  <Link href="/sign-up" className="mobile-cta" onClick={closeMenu}>
                    Get started
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}