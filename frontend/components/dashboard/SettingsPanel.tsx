"use client";

import { useUser } from "@clerk/nextjs";

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17.5 19H8a5 5 0 1 1 1.4-9.8A6 6 0 0 1 21 11a4 4 0 0 1-3.5 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="5"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function SettingsPanel() {
  const { user } = useUser();

  const name =
    user?.fullName ||
    user?.username ||
    "MediaGuard user";

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    "Authenticated account";

  const initials =
    user?.firstName?.[0] ||
    user?.username?.[0] ||
    "U";

  return (
    <div className="mg-page">
      <section className="mg-page-head">
        <div>
          <span className="mg-eyebrow">System</span>

          <h1>Settings</h1>

          <p>
            Manage your MediaGuard account and connected
            services.
          </p>
        </div>
      </section>

      <div className="mg-settings-layout">
        {/* ACCOUNT */}
        <section className="mg-settings-card">
          <div className="mg-panel-title">
            <div>
              <span className="mg-panel-kicker">
                Account
              </span>

              <h2>Your profile</h2>
            </div>

            <span className="mg-status-badge success">
              <CheckIcon />
              Secure
            </span>
          </div>

          <div className="mg-account-profile">
            <div className="mg-account-avatar">
              {user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={name}
                />
              ) : (
                initials.toUpperCase()
              )}
            </div>

            <div className="mg-account-info">
              <strong>{name}</strong>

              <span>{email}</span>

              <small>
                MediaGuard account
              </small>
            </div>
          </div>

          <div className="mg-divider" />

          <div className="mg-security-box">
            <div className="mg-security-icon">
              <ShieldIcon />
            </div>

            <div>
              <strong>Authentication secured</strong>

              <p>
                Your account is protected by Clerk.
                Authentication tokens are never stored
                directly in the MediaGuard database.
              </p>
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section className="mg-settings-card">
          <div className="mg-panel-title">
            <div>
              <span className="mg-panel-kicker">
                Infrastructure
              </span>

              <h2>Media pipeline</h2>
            </div>

            <span className="mg-status-badge success">
              <span className="mg-status-dot" />
              Ready
            </span>
          </div>

          <div className="mg-service-list">
            <div className="mg-service-row">
              <div className="mg-service-icon">
                <ShieldIcon />
              </div>

              <div className="mg-service-info">
                <strong>Authentication</strong>
                <span>User authentication and sessions</span>
              </div>

              <div className="mg-service-value">
                <span className="mg-status-dot" />
                Clerk
              </div>
            </div>

            <div className="mg-service-row">
              <div className="mg-service-icon">
                <CloudIcon />
              </div>

              <div className="mg-service-info">
                <strong>Media storage</strong>
                <span>Original and optimized media</span>
              </div>

              <div className="mg-service-value">
                <span className="mg-status-dot" />
                Cloudinary
              </div>
            </div>

            <div className="mg-service-row">
              <div className="mg-service-icon">
                <DatabaseIcon />
              </div>

              <div className="mg-service-info">
                <strong>Metadata</strong>
                <span>Media records and analysis data</span>
              </div>

              <div className="mg-service-value">
                <span className="mg-status-dot" />
                MongoDB
              </div>
            </div>

            <div className="mg-service-row">
              <div className="mg-service-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="mg-service-info">
                <strong>API</strong>
                <span>MediaGuard backend services</span>
              </div>

              <div className="mg-service-value">
                <span className="mg-status-dot" />
                Express
              </div>
            </div>
          </div>

          <div className="mg-settings-footer">
            <span>
              <span className="mg-status-dot" />
              System configuration
            </span>

            <span>Connected services</span>
          </div>
        </section>
      </div>
    </div>
  );
}