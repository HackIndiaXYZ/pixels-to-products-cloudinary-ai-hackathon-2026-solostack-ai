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

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box">
          <h2>Make every product image work harder.</h2>

          <p>
            Turn raw product media into intelligent, optimized and
            web-ready assets with MediaGuard AI.
          </p>

          <a href="/sign-up" className="btn btn-primary">
            Start optimizing
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}