function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

function SparkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

function ArrowCircle() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI-powered media pipeline
            </div>

            <h1 className="hero-title">
              Your product images.
              <br />
              <span className="gradient">Automatically optimized.</span>
            </h1>

            <p className="hero-description">
              MediaGuard AI analyzes, organizes and transforms product media
              into fast, web-ready assets through an intelligent Cloudinary
              pipeline.
            </p>

            <div className="hero-actions">
              <a href="/sign-up" className="btn btn-primary">
                Start optimizing
                <ArrowIcon />
              </a>

              <a href="#how-it-works" className="btn btn-secondary">
                See how it works
              </a>
            </div>

            <div className="hero-note">
              <span className="hero-note-dot" />
              Built for modern e-commerce teams
            </div>
          </div>

          <div className="hero-visual">
            <div className="pipeline-card">
              <div className="pipeline-top">
                <div className="pipeline-title">Media optimization</div>

                <div className="pipeline-status">
                  <span className="status-dot" />
                  Pipeline ready
                </div>
              </div>

              <div className="pipeline-body">
                <div className="media-preview">
                  <div className="media-image">
                    <div className="product-shape" />
                  </div>

                  <div className="media-info">
                    <div className="media-name">product-shoe.jpg</div>
                    <div className="media-meta">3.8 MB · 4000 × 4000</div>
                  </div>
                </div>

                <div className="pipeline-arrow">
                  <ArrowCircle />
                </div>

                <div className="media-preview">
                  <div className="media-image">
                    <div className="product-shape" />
                  </div>

                  <div className="media-info">
                    <div className="media-name">product-shoe.webp</div>
                    <div className="media-meta">680 KB · 1200 × 1200</div>
                  </div>
                </div>
              </div>

              <div className="pipeline-steps">
                <div className="pipeline-step">
                  <div className="step-icon">
                    <SparkIcon />
                  </div>

                  <div className="step-text">
                    <div className="step-name">AI analysis</div>
                    <div className="step-description">
                      Understand product content
                    </div>
                  </div>

                  <div className="step-check">
                    <CheckIcon />
                  </div>
                </div>

                <div className="pipeline-step">
                  <div className="step-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 16V8l8-4 8 4v8l-8 4-8-4Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m8 10 4 2 4-2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </div>

                  <div className="step-text">
                    <div className="step-name">Smart optimization</div>
                    <div className="step-description">
                      Quality, format and dimensions
                    </div>
                  </div>

                  <div className="step-check">
                    <CheckIcon />
                  </div>
                </div>

                <div className="pipeline-step">
                  <div className="step-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3v18M3 12h18"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  <div className="step-text">
                    <div className="step-name">Web-ready delivery</div>
                    <div className="step-description">
                      Optimized assets through Cloudinary
                    </div>
                  </div>

                  <div className="step-check">
                    <CheckIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}