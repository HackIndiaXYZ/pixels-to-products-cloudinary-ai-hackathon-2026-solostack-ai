function AnalyzeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OptimizeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9" cy="7" r="2" fill="#0f172a" stroke="currentColor" />
      <circle cx="15" cy="12" r="2" fill="#0f172a" stroke="currentColor" />
      <circle cx="11" cy="17" r="2" fill="#0f172a" stroke="currentColor" />
    </svg>
  );
}

function DeliverIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m13 7 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 5v14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const features = [
  {
    icon: <AnalyzeIcon />,
    title: "AI-powered analysis",
    description:
      "Understand product media with automated tags, quality insights and useful metadata.",
  },
  {
    icon: <OptimizeIcon />,
    title: "Smart optimization",
    description:
      "Automatically prepare images with the right quality, format and dimensions for delivery.",
  },
  {
    icon: <DeliverIcon />,
    title: "Web-ready delivery",
    description:
      "Transform and deliver optimized assets through Cloudinary without managing complex media infrastructure.",
  },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="features-header">
          <div>
            <span className="section-label">One intelligent workflow</span>

            <h2 className="section-title">
              From raw image to ready-to-use asset.
            </h2>
          </div>

          <p className="section-description">
            MediaGuard combines AI analysis with Cloudinary transformations so
            your team can spend less time preparing product media.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}