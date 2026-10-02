"use client";

import { useState, useEffect } from "react";
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

  const closeMenu = () => setOpen(false);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
            <Link href="#features" className="nav-link">
              Features
            </Link>

            <Link href="#how-it-works" className="nav-link">
              How it works
            </Link>

            <Link href="#cloudinary" className="nav-link">
              Cloudinary
            </Link>
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
              <Link href="#features" onClick={closeMenu}>
                Features
              </Link>

              <Link href="#how-it-works" onClick={closeMenu}>
                How it works
              </Link>

              <Link href="#cloudinary" onClick={closeMenu}>
                Cloudinary
              </Link>

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