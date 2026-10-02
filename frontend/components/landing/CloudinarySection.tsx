function CloudIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.5 18.5h9a4 4 0 0 0 .8-7.92A5.5 5.5 0 0 0 6.75 9.5 4.5 4.5 0 0 0 7.5 18.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const points = [
  "Media upload and secure asset storage",
  "AI-powered content analysis",
  "Automatic image transformations",
  "Quality and format optimization",
  "Fast media delivery",
];

export default function CloudinarySection() {
  return (
    <section id="cloudinary" className="section cloudinary-section">
      <div className="container">
        <div className="cloudinary-box">
          <div>
            <span className="section-label">Powered by Cloudinary</span>

            <h2 className="section-title">
              The media infrastructure behind the pipeline.
            </h2>

            <p className="section-description">
              MediaGuard uses Cloudinary to handle the heavy media operations
              while the application focuses on intelligent automation.
            </p>

            <div className="cloudinary-points">
              {points.map((point) => (
                <div className="cloudinary-point" key={point}>
                  <span className="cloudinary-check">✓</span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="cloudinary-visual">
            <div className="cloud-box">
              <div className="cloud-box-icon">
                <CloudIcon />
              </div>
              <h3>Cloudinary</h3>
              <p>Media infrastructure</p>
            </div>

            <div>
              <ArrowIcon />
            </div>

            <div className="cloud-box">
              <div className="cloud-box-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v18M3 12h18"
                    stroke="currentColor"
                    strokeWidth="1.6"
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
              <h3>Web-ready asset</h3>
              <p>Optimized delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}