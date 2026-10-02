"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function OverviewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V4M7 9l5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="9"
        cy="9"
        r="1.4"
        fill="currentColor"
      />
      <path
        d="m6 17 4-4 3 3 2-2 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.21a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.47 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.21A1.7 1.7 0 0 0 8.47 10a1.7 1.7 0 0 0-.34-1.87l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.87.34 1.7 1.7 0 0 0 1.04-1.56V5h2.4v.21a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.56 1.03h.21v2.4h-.21A1.7 1.7 0 0 0 19.4 15Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <OverviewIcon />,
  },
  {
    href: "/dashboard/upload",
    label: "Upload",
    icon: <UploadIcon />,
  },
  {
    href: "/dashboard/media",
    label: "Media library",
    icon: <MediaIcon />,
  },
];

export default function Sidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          mobileOpen ? "is-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <Link
            href="/"
            className="logo"
            onClick={onClose}
          >
            <span className="logo-mark" />

            <span className="logo-text">
              MediaGuard <span>AI</span>
            </span>
          </Link>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            Workspace
          </span>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-link ${
                    active ? "is-active" : ""
                  }`}
                >
                  <span className="sidebar-link-icon">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            System
          </span>

          <nav className="sidebar-nav">
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className={`sidebar-link ${
                pathname.startsWith("/dashboard/settings")
                  ? "is-active"
                  : ""
              }`}
            >
              <span className="sidebar-link-icon">
                <SettingsIcon />
              </span>

              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "sidebar-avatar",
                },
              }}
            />

            <div className="sidebar-user-copy">
              <span>Account</span>
              <small>Manage profile</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}