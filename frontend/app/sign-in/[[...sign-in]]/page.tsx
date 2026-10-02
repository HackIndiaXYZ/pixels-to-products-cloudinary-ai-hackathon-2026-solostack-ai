import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-background-grid" />
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-content">
        <Link href="/" className="auth-brand">
          <span className="logo-mark" />
          <span>
            MediaGuard <strong>AI</strong>
          </span>
        </Link>

        <div className="auth-card">
          <SignIn
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "auth-clerk-root",
                cardBox: "auth-clerk-card-box",
                card: "auth-clerk-card",
                headerTitle: "auth-clerk-title",
                headerSubtitle: "auth-clerk-subtitle",
                socialButtonsBlockButton: "auth-social-button",
                socialButtonsBlockButtonText: "auth-social-text",
                formFieldLabel: "auth-field-label",
                formFieldInput: "auth-field-input",
                formButtonPrimary: "auth-primary-button",
                footerActionLink: "auth-footer-link",
                identityPreviewText: "auth-identity-text",
                formFieldInputShowPasswordButton:
                  "auth-password-button",
                dividerLine: "auth-divider-line",
                dividerText: "auth-divider-text",
                footer: "auth-footer",
              },
            }}
          />
        </div>

        <p className="auth-security-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Protected by enterprise-grade encryption & Clerk authentication.
        </p>
      </div>
    </main>
  );
}