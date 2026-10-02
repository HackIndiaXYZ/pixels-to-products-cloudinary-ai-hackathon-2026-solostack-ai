"use client";

import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="dashboard-header">
      <button
        type="button"
        className="dashboard-mobile-menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="dashboard-header-spacer" />

      <div className="dashboard-header-actions">
        <div className="dashboard-status">
          <span />
          All systems ready
        </div>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "dashboard-avatar",
            },
          }}
        />
      </div>
    </header>
  );
}